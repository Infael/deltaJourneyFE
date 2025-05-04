import { Routes } from "@/router/routes";
import { authAtom } from "@/state/authAtom";
import { useGoogleLogin } from "@react-oauth/google";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const accessToken = sessionStorage.getItem("access_token");
  const isAuthenticated = accessToken !== null;
  const setAuthAtom = useSetAtom(authAtom);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "implicit",
    scope: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/analytics.readonly",
      "https://www.googleapis.com/auth/analytics.edit",
    ].join(" "),
    onSuccess: (data) => {
      if (data.access_token) {
        console.log("Login Successful:", data);
        sessionStorage.setItem("access_token", data.access_token);
        sessionStorage.setItem("expiration", String(Date.now() + data.expires_in * 1000));
        setAuthAtom({ authenticated: true });

        navigate("/projects");
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  const logout = () => {
    sessionStorage.clear();
    setAuthAtom({ authenticated: false });
    navigate(Routes.LANDING_PAGE);
  };

  // This effect runs when the component mounts and checks if the user is authenticated
  useEffect(() => {
    setAuthAtom({ authenticated: isAuthenticated });
  }, [accessToken, setAuthAtom]);

  return {
    login,
    logout,
    isAuthenticated,
    accessToken,
  };
};
