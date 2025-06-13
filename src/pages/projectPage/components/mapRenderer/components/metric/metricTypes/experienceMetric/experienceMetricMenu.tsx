import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppForm } from "@/hooks/useForm";
import { useFormResponses } from "@/hooks/useFormResponses";
import { resetExperienceMetricValueCommand } from "@/lib/project/commands/metricCommands/experienceMetricCommands/resetExperienceMetricValuesCommand";
import { updateExperienceMetricMetadataCommand } from "@/lib/project/commands/metricCommands/experienceMetricCommands/updateExperienceMetricMetadataCommand";
import { updateExperienceMetricValueCommand } from "@/lib/project/commands/metricCommands/experienceMetricCommands/updateExperienceMetricValueCommand";
import { MetricInfoExperience } from "@/lib/project/models/project";
import { projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtom } from "jotai";
import { FC } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface ExperienceMetricMenuProps {
  metricInfo: MetricInfoExperience;
}

export const ExperienceMetricMenu: FC<ExperienceMetricMenuProps> = ({ metricInfo }) => {
  const [, updateProject] = useAtom(projectWriteAtom);
  const { getTouchpointsExperienceAverages } = useFormResponses();

  const form = useAppForm({
    defaultValues: {
      path: metricInfo.path,
      lines: metricInfo.lines,
      emojis: metricInfo.emojis,
    },
    validators: {
      onChange: z.object({
        path: z.object({
          color: z.string(),
          curveSmoothness: z.number(),
        }),
        lines: z.object({
          hidden: z.boolean(),
          firstValue: z.number(),
          secondValue: z.number(),
        }),
        emojis: z.object({
          hidden: z.boolean(),
          colors: z.boolean(),
        }),
      }),
    },
    onSubmit: (value) => {
      updateProject((prev) => {
        return {
          ...prev,
          project: updateExperienceMetricMetadataCommand(prev.project, {
            versionId: prev.actualShowedVersion,
            updatedValues: { ...metricInfo, ...value.value },
          }),
        };
      });
    },
  });

  const resetData = () => {
    updateProject((prev) => {
      return {
        ...prev,
        project: resetExperienceMetricValueCommand(prev.project, {
          metricId: metricInfo.id,
          versionId: prev.actualShowedVersion,
        }),
      };
    });
  };

  const loadData = () => {
    const touchpointAverages = getTouchpointsExperienceAverages();
    if (!touchpointAverages) {
      toast.error("No data found, be sure you have a form published.");
      return;
    }
    updateProject((prev) => {
      let newProject = prev.project;
      touchpointAverages.forEach((touchpoint) => {
        const value = touchpoint.average;
        if (value !== undefined) {
          newProject = updateExperienceMetricValueCommand(newProject, {
            metricId: metricInfo.id,
            touchpointId: touchpoint.touchpointId,
            value: value,
            versionId: prev.actualShowedVersion,
          });
        }
      });
      return {
        ...prev,
        project: newProject,
      };
    });
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Settings</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Data</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={resetData}>Reset</DropdownMenuItem>
              <DropdownMenuItem onClick={loadData}>Load from form (experimental)</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Path</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                onInput={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-1 px-2"
              >
                <div className="flex items-center justify-between">
                  <form.AppField name="path.color">
                    {(field) => <field.TextField label="Color" type="color" />}
                  </form.AppField>
                </div>
                <DropdownMenuSeparator />
                <form.AppField name="path.curveSmoothness">
                  {(field) => (
                    <field.SliderField label="Curve smoothness" showValue={false} min={0} max={1} step={0.05} />
                  )}
                </form.AppField>
              </form>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Lines</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <form
                onChange={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col justify-between px-2 py-1"
              >
                <form.AppField name="lines.hidden">{(field) => <field.CheckboxField label="Hidden" />}</form.AppField>
              </form>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Emojis</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <form
                onChange={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col justify-between gap-2 px-2 py-1"
              >
                <form.AppField name="emojis.hidden">{(field) => <field.CheckboxField label="Hidden" />}</form.AppField>
                <form.AppField name="emojis.colors">{(field) => <field.CheckboxField label="Colors" />}</form.AppField>
              </form>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
};
