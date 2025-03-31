import { FC } from "react";

export const ErrorPage: FC = () => {
  return (
    <div className="flex w-full items-center justify-center py-64">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg">Page not found</p>
      </div>
    </div>
  );
};
