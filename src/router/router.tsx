import { PageWrapper } from "@/components/layout/pageWrapper";
import { AuthorizedRoute } from "@/components/wrapper/authorizedRoute";
import { SuspenseWrapper } from "@/components/wrapper/suspenseWrapper";
import { AllProjectsPage } from "@/pages/allProjectsPage/allProjectsPage";
import { ErrorPage } from "@/pages/errorPage/errorPage";
import { LandingPage } from "@/pages/landingPage/landingPage";
import { ProjectPage } from "@/pages/projectPage/projectPage";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Routes } from "./routes";

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PageWrapper />}>
      <Route path={Routes.LANDING_PAGE} errorElement={<ErrorPage />}>
        <Route path={Routes.LANDING_PAGE} element={<LandingPage />} />
        <Route element={<AuthorizedRoute />}>
          <Route
            path={Routes.ALL_PROJECTS_PAGE}
            element={
              <SuspenseWrapper>
                <AllProjectsPage />
              </SuspenseWrapper>
            }
          />
          <Route
            path={Routes.PROJECT_PAGE}
            element={
              <SuspenseWrapper>
                <ProjectPage />
              </SuspenseWrapper>
            }
          />
        </Route>
      </Route>
    </Route>,
  ),
  { basename: `/${import.meta.env.BASE_URL.replace("/", "")}` },
);
