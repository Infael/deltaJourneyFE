import { FC, Suspense } from "react";
import { Spinner } from "../ui/spinner/spinner";

interface SuspenseWrapperProps {
  children: React.ReactNode;
}

export const SuspenseWrapper: FC<SuspenseWrapperProps> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="flex w-screen items-center justify-center py-64">
          <Spinner text="Loading..." />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};
