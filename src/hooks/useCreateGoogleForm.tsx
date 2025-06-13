import { useDriveFilesDelete } from "@/api/driveApi/drive-api";
import { FormsFormsCreateMutationResult, useFormsFormsBatchUpdate, useFormsFormsCreate } from "@/api/formApi/form-api";
import { RatingQuestionIconType, Request } from "@/api/formApi/form-api.schemas";
import { projectAtom } from "@/state/projectAtom";
import { currentProjectVersionAtom, deleteHistoryAtom, projectWriteAtom } from "@/state/projectWriteAtom";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "sonner";

const SHIFT = 3;

export const useCreateGoogleForm = (onComplete: () => void) => {
  const { current: project } = useAtomValue(projectAtom);
  const updateProject = useSetAtom(projectWriteAtom);
  const actualVersion = useAtomValue(currentProjectVersionAtom);
  const deleteHistory = useSetAtom(deleteHistoryAtom);

  const { mutateAsync: createForm, isPending: isCreating } = useFormsFormsCreate();
  const { mutateAsync: updateForm, isPending: isUpdating } = useFormsFormsBatchUpdate();
  const { mutateAsync: deleteForm } = useDriveFilesDelete();

  const createQuestions = () => {
    return {
      includeFormInResponse: true,
      requests: actualVersion!.touchpoints.flatMap((touchpoint, index): Request[] => {
        return [
          {
            createItem: {
              location: { index: SHIFT * index },
              item: {
                title: `How do you rate ${touchpoint.name}?`,
                questionItem: {
                  question: {
                    questionId: `${SHIFT * index}`,
                    required: true,
                    ratingQuestion: {
                      ratingScaleLevel: 5,
                      iconType: RatingQuestionIconType.STAR,
                    },
                  },
                },
              },
            },
          },
          {
            createItem: {
              location: { index: SHIFT * index + 1 },
              item: {
                title: `What do you find positive about ${touchpoint.name}?`,
                questionItem: {
                  question: {
                    questionId: `${SHIFT * index + 1}`,
                    required: false,
                    textQuestion: {
                      paragraph: false,
                    },
                  },
                },
              },
            },
          },
          {
            createItem: {
              location: { index: SHIFT * index + 2 },
              item: {
                title: `What do you find negative about ${touchpoint.description}?`,
                questionItem: {
                  question: {
                    questionId: `${SHIFT * index + 2}`,
                    required: false,
                    textQuestion: {
                      paragraph: true,
                    },
                  },
                },
              },
            },
          },
        ];
      }),
    };
  };

  const onFormCreated = (data: FormsFormsCreateMutationResult) => {
    if (!data.formId || !data.responderUri || !actualVersion) {
      toast.error("Form creation response is missing formId or responderUri");
      return;
    }
    // create questions in form

    toast.promise(
      updateForm(
        {
          formId: data.formId,
          data: createQuestions(),
        },
        {
          onSuccess: (formData) => {
            updateProject((prev) => ({
              ...prev,
              project: {
                ...prev.project,
                formData: {
                  id: data.formId ?? "",
                  responderUri: data.responderUri ?? "",
                  touchpointFormQuestions: actualVersion.touchpoints.map((touchpoint, index) => ({
                    touchpointId: touchpoint.id,
                    experienceId:
                      // little bit dumb solution, nobody should do it like this, but it works for now
                      formData.form?.items?.find(
                        (item) =>
                          item.questionItem?.question?.questionId === (SHIFT * index).toString().padStart(8, "0"),
                      )?.questionItem?.question?.questionId ?? "",
                    gainId:
                      formData.form?.items?.find(
                        (item) =>
                          item.questionItem?.question?.questionId === (SHIFT * index + 1).toString().padStart(8, "0"),
                      )?.questionItem?.question?.questionId ?? "",
                    painId:
                      formData.form?.items?.find(
                        (item) =>
                          item.questionItem?.question?.questionId === (SHIFT * index + 2).toString().padStart(8, "0"),
                      )?.questionItem?.question?.questionId ?? "",
                  })),
                },
              },
            }));
            deleteHistory();
            onComplete();
          },
          onError: () => {
            if (data.formId) {
              deleteForm({ fileId: data.formId });
            }
          },
        },
      ),
      {
        loading: "Creating form questions...",
        success: "Form questions created successfully",
        error: "Error creating form questions",
      },
    );
  };

  const handleCreateForm = () => {
    toast.promise(
      createForm(
        {
          data: {
            info: {
              documentTitle: project.projectMetadata.name,
              title: project.projectMetadata.name,
            },
          },
        },
        {
          onSuccess: onFormCreated,
        },
      ),
      {
        loading: "Creating form...",
        success: "Form created successfully",
        error: "Error creating form",
      },
    );
  };

  const isLoading = isCreating || isUpdating;

  return {
    handleCreateForm,
    isLoading,
  };
};
