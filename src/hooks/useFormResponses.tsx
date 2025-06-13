import { useFormsFormsResponsesList } from "@/api/formApi/form-api";
import { Answer, FormResponse } from "@/api/formApi/form-api.schemas";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { useCallback } from "react";

// TODO make time filter based on current project version
export const useFormResponses = () => {
  const { current: project } = useAtomValue(projectAtom);

  const formId = project.project.formData?.id;
  const { data, isPending } = useFormsFormsResponsesList(formId || "");

  const filterData = useCallback(
    (questionId: string): string[] => {
      if (!data) return [];

      return (
        data.responses
          ?.filter(
            (item: FormResponse) =>
              item.answers &&
              item.answers[questionId] &&
              (item.answers[questionId] as Answer).questionId === questionId,
          )
          .map((item: FormResponse) => {
            const answer = item.answers ? (item.answers[questionId] as Answer) : undefined;
            return answer && answer.textAnswers && answer.textAnswers.answers && answer.textAnswers.answers[0]
              ? answer.textAnswers.answers[0].value
              : "";
          })
          .filter((item): item is string => typeof item === "string" && item !== "") ?? []
      );
    },
    [data],
  );

  const getTouchpointExperienceAnswers = useCallback(
    (touchpointId: string) => {
      if (!project?.project.formData) return [];

      const questionId = project.project.formData.touchpointFormQuestions?.find(
        (item) => item.touchpointId === touchpointId,
      )?.experienceId;

      if (!questionId) return [];

      const answers = filterData(questionId);
      return answers;
    },
    [data, project, filterData],
  );

  const getTouchpointsExperienceAverages = useCallback(() => {
    // for each touchpoint create an object with touchpointId and average value
    if (!project?.project.formData) return;

    const touchpointIds = project.project.formData.touchpointFormQuestions?.map((item) => item.touchpointId) ?? [];
    const averages: { touchpointId: string; average: number }[] = [];
    touchpointIds.forEach((touchpointId) => {
      const answers = getTouchpointExperienceAnswers(touchpointId);
      if (answers.length === 0) return;

      const sum = answers.reduce((acc, curr) => acc + parseFloat(curr), 0);
      const average = sum / answers.length;

      // average is between 1 and 5, scale it to be between 0 and 100
      const scaledAverage = ((average - 1) / 4) * 100;

      averages.push({ touchpointId, average: scaledAverage });
    });
    return averages;
  }, [data, project, getTouchpointExperienceAnswers]);

  const getTouchpointGainAnswers = useCallback(
    (touchpointId: string) => {
      if (!project?.project.formData) return [];

      const questionId = project.project.formData.touchpointFormQuestions?.find(
        (item) => item.touchpointId === touchpointId,
      )?.gainId;

      if (!questionId) return [];

      const answers = filterData(questionId);

      return answers;
    },
    [data, project, filterData],
  );

  const getTouchpointPainAnswers = useCallback(
    (touchpointId: string) => {
      if (!project?.project.formData) return [];

      const questionId = project.project.formData.touchpointFormQuestions?.find(
        (item) => item.touchpointId === touchpointId,
      )?.painId;

      if (!questionId) return [];

      const answers = filterData(questionId);

      return answers;
    },
    [data, project, filterData],
  );

  return {
    getTouchpointExperienceAnswers,
    getTouchpointsExperienceAverages,
    getTouchpointGainAnswers,
    getTouchpointPainAnswers,
    isLoading: !data || isPending,
  };
};
