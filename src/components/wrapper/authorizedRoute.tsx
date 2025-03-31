import { useAuth } from "@/hooks/useAuth";
import { Routes } from "@/router/routes";
import { Outlet, useNavigate } from "react-router-dom";

export const AuthorizedRoute = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate(Routes.LANDING_PAGE);
    return null;
  }

  return <Outlet />;
};
