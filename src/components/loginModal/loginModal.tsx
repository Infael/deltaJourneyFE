import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export const LoginModal = () => {
  const { login } = useAuth();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Start creating</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to your Google Account to start creating your customer journey.</DialogTitle>
          <DialogDescription className="hidden">
            Connect to your Google Account to start creating your customer journey.
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            onClick={() => {
              login();
            }}
          >
            Use Google Drive
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
