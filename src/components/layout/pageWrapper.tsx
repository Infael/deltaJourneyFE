import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router-dom";
import { Footer } from "./footer/footer";
import { Navigation } from "./navigation/navigation";

export const PageWrapper = () => {
  useAuth(); // To check sessionStorage if the user is logged in

  return (
    <>
      <Navigation />
      <main className="w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
