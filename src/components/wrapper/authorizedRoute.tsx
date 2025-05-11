import { useAuth } from "@/hooks/useAuth";
import { Routes } from "@/router/routes";
import { projectAtom } from "@/state/projectAtom";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const AuthorizedRoute = () => {
  const { isAuthenticated } = useAuth();
  const { current } = useAtomValue(projectAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && current.projectStorage !== "local") {
      navigate(Routes.LANDING_PAGE);
    }
  }, [isAuthenticated]);

  return <Outlet />;
};
