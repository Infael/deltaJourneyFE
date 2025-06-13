import { useCreateGoogleForm } from "@/hooks/useCreateGoogleForm";
import { FC } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Paragraph } from "../ui/paragraph";

interface NewFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NewFormModal: FC<NewFormModalProps> = ({ open, setOpen }) => {
  const { handleCreateForm, isLoading } = useCreateGoogleForm(() => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create new form for this journey</DialogTitle>
          <DialogDescription>
            Here you can create a new form, using Google Forms, to collect data from respondents about their journey.
          </DialogDescription>
          <Paragraph size="small" variant="fadedDark">
            This feature is currently under development. Your form will be{" "}
            <strong>created from your touchpoints</strong> and it couldn&apos;t be edited after creation. If you add
            more touchpoints later, you will need to create a new form to start collecting data for it. That will result
            in <strong>losing all data</strong> collected in the previous form. Be sure to{" "}
            <strong>add all touchpoints</strong> you want to include in the form before creating it.
          </Paragraph>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="noShadowNeutral" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="noShadow"
            disabled={isLoading}
            onClick={() => {
              handleCreateForm();
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
