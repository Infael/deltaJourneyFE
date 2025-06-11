import { useAnalyticsadminAccountSummariesListSuspense } from "@/api/gaAdminApi/gaAdminApi";
import { useAnalyticsdataPropertiesRunReport } from "@/api/gaDataApi/gaDataApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Paragraph } from "@/components/ui/paragraph";
import { useAppForm } from "@/hooks/useForm";
import { removeNumericMetricValueCommand } from "@/lib/project/commands/metricCommands/numericMetricCommands/removeNumericMetricCommand";
import { updateNumericMetricValueCommand } from "@/lib/project/commands/metricCommands/numericMetricCommands/updateNumericMetricCommand";
import { GAMetricType, MetricType, NumericMetricData, NumericMetricKey } from "@/lib/project/models/metrics";
import { currentProjectVersionAtom, projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { DialogClose } from "@radix-ui/react-dialog";

import { useAtom, useAtomValue } from "jotai";
import { FC, useMemo, useState } from "react";
import { z } from "zod";

interface NumericMetricFormDialogProps {
  children: React.ReactNode;
  defaultValue?: NumericMetricData;
  metricId: string;
  touchpointId: string;
}

export const NumericMetricFormDialog: FC<NumericMetricFormDialogProps> = ({
  children,
  defaultValue,
  metricId,
  touchpointId,
}) => {
  const { presentationMode, editable } = useAtomValue(viewAtom);
  const projectVersion = useAtomValue(currentProjectVersionAtom);
  const [, updateProject] = useAtom(projectWriteAtom);

  const [open, setOpen] = useState(false);

  const { data: properties } = useAnalyticsadminAccountSummariesListSuspense();
  const { mutateAsync: runReport } = useAnalyticsdataPropertiesRunReport();

  const propertiesNamesAndIds = useMemo(() => {
    if (!properties || !properties.accountSummaries) {
      return [];
    }
    return properties.accountSummaries
      .map((account) => {
        if (!account.propertySummaries) {
          return [];
        }
        const properties = account.propertySummaries.map((property) => ({
          value: property.property ?? "",
          label: property.displayName ?? "",
        }));
        return properties;
      })
      .flat();
  }, [properties]);

  let initialValue;

  switch (defaultValue?.numericTypeKey) {
    case NumericMetricKey.MANUAL:
      initialValue = {
        type: NumericMetricKey.MANUAL,
        manualProperties: {
          rangeType: "range",
          range: {
            min: defaultValue?.manualProperties?.range.min.toString() ?? "0",
            max: defaultValue?.manualProperties?.range.max.toString() ?? "100",
          },
          value: defaultValue?.value?.toString() ?? "0",
        },
        gaProperties: {
          property: "",
          metric: GAMetricType.ACTIVE_USERS,
        },
        graphSettings: {
          color: defaultValue.graphSettings.color,
        },
        valueSettings: {
          color: defaultValue.valueSettings.color,
          hidden: defaultValue.valueSettings.hidden,
          prefix: defaultValue.valueSettings.prefix,
          suffix: defaultValue.valueSettings.suffix,
        },
      };
      break;
    case NumericMetricKey.GA:
      initialValue = {
        type: NumericMetricKey.GA,
        manualProperties: {
          rangeType: "range",
          range: {
            min: "0",
            max: "100",
          },
          value: "0",
        },
        gaProperties: {
          property: defaultValue?.gaProperties?.property ?? "",
          metric: defaultValue?.gaProperties?.metric ?? GAMetricType.ACTIVE_USERS,
        },
        graphSettings: {
          color: defaultValue.graphSettings.color,
        },
        valueSettings: {
          color: defaultValue.valueSettings.color,
          hidden: defaultValue.valueSettings.hidden,
          prefix: defaultValue.valueSettings.prefix,
          suffix: defaultValue.valueSettings.suffix,
        },
      };
      break;
    default:
      initialValue = {
        type: NumericMetricKey.MANUAL,
        manualProperties: {
          rangeType: "range",
          range: {
            min: "0",
            max: "100",
          },
          value: "0",
        },
        gaProperties: {
          property: "",
          metric: GAMetricType.ACTIVE_USERS,
        },
        graphSettings: {
          color: "#0000FF",
        },
        valueSettings: {
          color: "#000000",
          hidden: false,
          prefix: "",
          suffix: "",
        },
      };
      break;
  }

  const form = useAppForm({
    defaultValues: initialValue,
    validators: {
      onChange: z.object({
        type: z.enum([NumericMetricKey.MANUAL, NumericMetricKey.GA]),
        manualProperties: z
          .object({
            rangeType: z.enum(["range", "percentage", "unlimited"]),
            range: z
              .object({
                min: z.string(),
                max: z.string(),
              })
              .refine(({ min, max }) => parseFloat(min) < parseFloat(max), {
                message: "Min must be less than Max",
                path: ["max"],
              }),
            value: z.string().nonempty("Value is required"),
          })
          .refine(
            (data) => {
              if (data.rangeType === "range") {
                return (
                  parseFloat(data.value) >= parseFloat(data.range.min) &&
                  parseFloat(data.value) <= parseFloat(data.range.max)
                );
              }
              return true;
            },
            {
              message: "Value must be within the selected range",
              path: ["value"],
            },
          )
          .refine(
            (data) => {
              if (data.rangeType === "percentage") {
                return parseFloat(data.value) >= 0 && parseFloat(data.value) <= 100;
              }
              return true;
            },
            {
              message: "Value must be between 0 and 100",
              path: ["value"],
            },
          ),
        gaProperties: z.object({
          property: z.string(),
          metric: z.enum([
            GAMetricType.ACTIVE_USERS,
            GAMetricType.NEW_USERS,
            GAMetricType.ENGAGED_SESSIONS,
            GAMetricType.ENGAGEMENT_RATE,
            GAMetricType.CONVERSIONS,
            GAMetricType.CONVERSION_RATE,
            GAMetricType.TOTAL_USERS,
            GAMetricType.SESSIONS,
            GAMetricType.BOUNCE_RATE,
            GAMetricType.AVERAGE_SESSION_DURATION,
            GAMetricType.SCREEN_PAGE_VIEWS,
          ]),
        }),
        graphSettings: z.object({
          color: z.string(),
        }),
        valueSettings: z.object({
          color: z.string(),
          hidden: z.boolean(),
          prefix: z.string(),
          suffix: z.string(),
        }),
      }),
    },
    onSubmit: (data) => {
      if (data.value.type === NumericMetricKey.GA) {
        runReport({
          property: data.value.gaProperties.property,
          data: {
            dateRanges: [
              {
                startDate: (
                  projectVersion?.startDate ?? new Date(new Date().setDate(new Date().getMonth() - 1)).toISOString()
                ).split("T")[0],
                endDate: (projectVersion?.endDate ?? new Date().toISOString()).split("T")[0],
              },
            ],
            metrics: [
              {
                name: `${data.value.gaProperties.metric}_DeltaJourney`,
                expression: data.value.gaProperties.metric,
              },
            ],
          },
        }).then((response) => {
          const value = response.rows?.[0]?.metricValues?.[0]?.value;
          if (value) {
            updateProject((project) => {
              const newProject = updateNumericMetricValueCommand(project.project, {
                metricId,
                touchpointId,
                versionId: project.actualShowedVersion,
                value: {
                  id: metricId,
                  key: MetricType.NUMERIC,
                  numericTypeKey: NumericMetricKey.GA,
                  value: parseFloat(value),
                  gaProperties: {
                    property: data.value.gaProperties.property,
                    metric: data.value.gaProperties.metric,
                  },
                  graphSettings: {
                    color: data.value.graphSettings.color,
                    hidden: true,
                  },
                  valueSettings: {
                    color: data.value.valueSettings.color,
                    hidden: false,
                    prefix: data.value.valueSettings.prefix,
                    suffix: data.value.valueSettings.suffix,
                  },
                },
              });
              return {
                ...project,
                project: newProject,
              };
            });
          }
        });
      } else {
        updateProject((project) => {
          const newProject = updateNumericMetricValueCommand(project.project, {
            metricId,
            touchpointId,
            versionId: project.actualShowedVersion,
            value: {
              id: metricId,
              key: MetricType.NUMERIC,
              numericTypeKey: NumericMetricKey.MANUAL,
              value: parseFloat(data.value.type === NumericMetricKey.MANUAL ? data.value.manualProperties.value : "0"),
              manualProperties:
                data.value.type === NumericMetricKey.MANUAL
                  ? {
                      range: {
                        min: parseFloat(data.value.manualProperties.range.min),
                        max: parseFloat(data.value.manualProperties.range.max),
                      },
                    }
                  : undefined,
              graphSettings: {
                color: data.value.graphSettings.color,
                hidden: data.value.manualProperties.rangeType === "unlimited",
              },
              valueSettings: {
                color: data.value.valueSettings.color,
                hidden: false,
                prefix: data.value.valueSettings.prefix,
                suffix: data.value.valueSettings.suffix,
              },
            },
          });
          return {
            ...project,
            project: newProject,
          };
        });
      }
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex-1 cursor-pointer disabled:cursor-default" disabled={presentationMode || !editable}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Data</DialogTitle>
          <DialogDescription className="hidden">Dialog for inserting numeric metric data</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="type">
            {(field) => (
              <field.SelectField
                label="Select data source:"
                items={[
                  { label: "Manual", value: NumericMetricKey.MANUAL },
                  { label: "Google Analytics", value: NumericMetricKey.GA },
                ]}
              />
            )}
          </form.AppField>
          <form.Subscribe selector={(state) => state.values.type}>
            {(type) => {
              if (type === NumericMetricKey.MANUAL) {
                return (
                  <>
                    <form.AppField
                      name="manualProperties.rangeType"
                      listeners={{
                        onChange: (field) =>
                          form.setFieldValue("valueSettings.suffix", field.value === "percentage" ? "%" : ""),
                      }}
                    >
                      {(field) => (
                        <field.SelectField
                          label="Select range type:"
                          items={[
                            { label: "Range", value: "range" },
                            { label: "Percentage", value: "percentage" },
                            { label: "Without range", value: "unlimited" },
                          ]}
                        />
                      )}
                    </form.AppField>
                    <form.Subscribe selector={(state) => state.values.manualProperties}>
                      {(manualProperties) => {
                        if (manualProperties.rangeType === "range") {
                          return (
                            <>
                              <form.AppField name="manualProperties.range.min">
                                {(field) => <field.TextField label="Min value:" type="number" />}
                              </form.AppField>
                              <form.AppField name="manualProperties.range.max">
                                {(field) => <field.TextField label="Max value:" type="number" />}
                              </form.AppField>
                            </>
                          );
                        }
                        return null;
                      }}
                    </form.Subscribe>
                    <form.AppField name="manualProperties.value">
                      {(field) => <field.TextField label="Value:" type="number" />}
                    </form.AppField>
                  </>
                );
              }
              if (type === NumericMetricKey.GA) {
                return (
                  <>
                    {/* TODO - no property found */}
                    <form.AppField name="gaProperties.property">
                      {(field) => (
                        <field.SelectField
                          label="GA Property:"
                          placeholder="Select GA Property"
                          items={propertiesNamesAndIds}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="gaProperties.metric">
                      {(field) => (
                        <field.SelectField
                          label="Select GA metric:"
                          items={[
                            { label: "Active Users", value: GAMetricType.ACTIVE_USERS },
                            { label: "New Users", value: GAMetricType.NEW_USERS },
                            { label: "Total Users", value: GAMetricType.TOTAL_USERS },
                            { label: "Sessions", value: GAMetricType.SESSIONS },
                            { label: "Bounce Rate", value: GAMetricType.BOUNCE_RATE },
                            { label: "Engaged Sessions", value: GAMetricType.ENGAGED_SESSIONS },
                            { label: "Engagement Rate", value: GAMetricType.ENGAGEMENT_RATE },
                            { label: "Conversions", value: GAMetricType.CONVERSIONS },
                            { label: "Conversion Rate", value: GAMetricType.CONVERSION_RATE },
                            { label: "Average Session Duration", value: GAMetricType.AVERAGE_SESSION_DURATION },
                            { label: "Screen Page Views", value: GAMetricType.SCREEN_PAGE_VIEWS },
                          ]}
                        />
                      )}
                    </form.AppField>
                    <Paragraph size="micro">
                      The value will be automatically fetched from Google Analytics from current version start date (
                      {new Date(projectVersion?.startDate ?? "").toLocaleString("sk-SK", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                      ) to end date (
                      {new Date(projectVersion?.endDate ?? "").toLocaleString("sk-SK", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                      ).
                    </Paragraph>
                  </>
                );
              }
              return null;
            }}
          </form.Subscribe>
          <hr />
          <form.Subscribe selector={(state) => state.values}>
            {(values) => {
              if (values.type === NumericMetricKey.MANUAL && values.manualProperties.rangeType !== "unlimited") {
                return (
                  <form.AppField name="graphSettings.color">
                    {(field) => <field.TextField label="Graph color:" type="color" />}
                  </form.AppField>
                );
              }
              return null;
            }}
          </form.Subscribe>
          <form.AppField name="valueSettings.color">
            {(field) => <field.TextField label="Value color:" type="color" />}
          </form.AppField>
          <form.AppField name="valueSettings.prefix">{(field) => <field.TextField label="Prefix:" />}</form.AppField>
          <form.AppField name="valueSettings.suffix">{(field) => <field.TextField label="Suffix:" />}</form.AppField>

          <DialogFooter className="justify-between pt-4">
            <DialogClose asChild>
              <Button variant="neutral" onClick={() => form.reset()}>
                Cancel
              </Button>
            </DialogClose>
            {defaultValue && (
              <DialogClose asChild>
                <Button
                  variant="danger"
                  onClick={() => {
                    updateProject((project) => ({
                      ...project,
                      project: removeNumericMetricValueCommand(project.project, {
                        metricId,
                        touchpointId,
                        versionId: project.actualShowedVersion,
                      }),
                    }));
                    form.reset();
                  }}
                >
                  Remove
                </Button>
              </DialogClose>
            )}
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
