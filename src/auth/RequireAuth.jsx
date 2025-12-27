import { Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth() {
  const { isLoading } = useAuth();

  if (isLoading) return null;

  // ❌ NÃO REDIRECIONA
  // ❌ NÃO MANDA PRA /login
  // ❌ NÃO MANDA PRA /

  return <Outlet />;
}
