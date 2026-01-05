import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

if (!user) {
  if (!localStorage.getItem("postLoginRedirect")) {
    localStorage.setItem(
      "postLoginRedirect",
      location.pathname + location.search
    );
  }

  return <Navigate to="/login" replace />;
}

  return <Outlet />;
}
