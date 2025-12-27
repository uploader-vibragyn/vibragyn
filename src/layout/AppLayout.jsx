import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "../components/Navbar";
import PublicTopBar from "../components/PublicTopBar";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0b0f16" }} />
    );
  }

  return (
    <>
      {user ? <Navbar /> : <PublicTopBar />}
      <Outlet />
    </>
  );
}
