import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "../components/Navbar";
import PublicTopBar from "../components/PublicTopBar";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ minHeight: "100vh", background: "#0b0f16" }} />;
  }

  // 🔴 IMPORTANTE:
  // Navbar já contém <Outlet />
  // Logo, NÃO renderizamos <Outlet /> aqui quando user existe
  if (user) {
    return <Navbar />;
  }

  // Público: topbar simples + outlet
  return (
    <>
      <PublicTopBar />
      <Outlet />
    </>
  );
}
