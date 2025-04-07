import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./api/queryClient";
import { Toaster } from "./components/ui/sonner";
import { Router } from "./router/router";

import "./index.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={Router} />
        <Toaster />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
