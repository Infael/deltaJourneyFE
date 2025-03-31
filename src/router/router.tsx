import { PageWrapper } from "@/components/layout/pageWrapper";
import { Spinner } from "@/components/ui/spinner/spinner";
import { AuthorizedRoute } from "@/components/wrapper/authorizedRoute";
import { ErrorPage } from "@/pages/errorPage/errorPage";
import { LandingPage } from "@/pages/landingPage/landingPage";
import { ProjectPage } from "@/pages/projectsPage/ProjectsPage";
import { Suspense } from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route } from "react-router-dom";
import { Routes } from "./routes";

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PageWrapper />}>
      <Route
        path={Routes.LANDING_PAGE}
        element={
          <Suspense
            fallback={
              <div className="flex w-screen items-center justify-center py-64">
                <Spinner text="Loading..." />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        }
        errorElement={<Navigate to={Routes.ERROR_PAGE} />}
      >
        <Route path={Routes.LANDING_PAGE} element={<LandingPage />} />
        <Route path={Routes.ERROR_PAGE} element={<ErrorPage />} />
        <Route element={<AuthorizedRoute />}>
          <Route path={Routes.PROJECTS_PAGE} element={<ProjectPage />} />
        </Route>
      </Route>
    </Route>,
  ),
);
