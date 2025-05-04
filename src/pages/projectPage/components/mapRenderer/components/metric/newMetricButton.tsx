import { Paragraph } from "@/components/ui/paragraph";
import { useAtomValue, useSetAtom } from "jotai";
import { MapCell } from "../mapCell";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/hooks/useForm";
import { addMetricCommand } from "@/lib/project/commands/metricCommands/addMetricCommand";
import { MetricType } from "@/lib/project/models/metrics";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { viewAtom } from "@/state/viewAtom";
import { FC } from "react";
import { z } from "zod";
import plusIcon from "../../assets/plusIcon.svg";

interface NewMetricButtonProps {
  gridSize: number;
}

export const NewMetricButton: FC<NewMetricButtonProps> = ({ gridSize }) => {
  const { presentationMode } = useAtomValue(viewAtom);
  const updateProject = useSetAtom(projectWriteAtom);

  const form = useAppForm({
    defaultValues: {
      name: "New Metric",
      type: MetricType.TEXT,
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Metric name is required").max(64, "Metric name is too long"),
        type: z.enum([MetricType.TEXT, MetricType.EXPERIENCE, MetricType.NUMERIC]),
      }),
    },
    onSubmit: (data) => {
      updateProject((prev) => {
        const newProject = addMetricCommand(prev.project, {
          name: data.value.name,
          versionId: prev.actualShowedVersion,
          metricKey: data.value.type,
        });

        return {
          ...prev,
          project: newProject,
        };
      });
    },
  });

  const getMetricTypeDescription = (metricType: MetricType) => {
    switch (metricType) {
      case MetricType.TEXT:
        return "Use this metric to capture qualitative insights, notes, or open-ended feedback for each touchpoint.";
      case MetricType.EXPERIENCE:
        return "This metric represents a visual graph of customer sentiment across the journey. Values can be adjusted manually to reflect emotional highs and lows.";
      case MetricType.NUMERIC:
        return "Use this metric to track numerical values at each touchpoint, such as conversion rates, time spent, or custom KPIs. Data can be imported or entered manually.";
      default:
        return "";
    }
  };

  if (presentationMode) {
    return null;
  }

  return (
    <MapCell className="hover:bg-main hover:cursor-pointer" gridSize={gridSize}>
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex w-full flex-col items-center gap-4 p-4">
            <img src={plusIcon} alt="add new Metric" className="h-32" />
            <Paragraph>New Metric</Paragraph>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new Metric</DialogTitle>
            <DialogDescription className="hidden">Dialog for adding new metric</DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.AppField name="name">
              {(field) => <field.TextField label="Enter metric name:" placeholder="Metric name" />}
            </form.AppField>
            <form.AppField name="type">
              {(field) => (
                <field.SelectField
                  label="Select type:"
                  items={[
                    { label: "Text", value: MetricType.TEXT },
                    { label: "Experience", value: MetricType.EXPERIENCE },
                    {
                      label: "Numeric",
                      value: MetricType.NUMERIC,
                    },
                  ]}
                />
              )}
            </form.AppField>
            <form.Subscribe selector={(state) => state.values.type}>
              {(type) => <Paragraph size="small">{getMetricTypeDescription(type)}</Paragraph>}
            </form.Subscribe>
            <DialogClose asChild>
              <Button type="submit" className="mt-4">
                Create
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </MapCell>
  );
};
