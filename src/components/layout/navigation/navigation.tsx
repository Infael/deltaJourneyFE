import { LoginModal } from "@/components/loginModal/loginModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Routes } from "@/router/routes";
import { Link, useNavigate } from "react-router-dom";
import { Heading } from "../../ui/heading";
import styles from "./navigation.module.css";

export const Navigation = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={cn("bg-bw flex w-full items-center justify-between px-8 py-4", styles.navBorder)}>
      <Link to={Routes.LANDING_PAGE} className="flex items-center gap-8">
        <img src="DeltaJourney.svg" alt="Logo" width={60} />
        <Heading level="h2">DeltaJourney</Heading>
      </Link>
      {!isAuthenticated && <LoginModal />}
      {isAuthenticated && (
        <div className="flex gap-4">
          <Button
            onClick={() => {
              navigate(Routes.ALL_PROJECTS_PAGE);
            }}
          >
            My Maps
          </Button>
          <Button variant="neutral" onClick={logout}>
            Log Out
          </Button>
        </div>
      )}
    </nav>
  );
};
