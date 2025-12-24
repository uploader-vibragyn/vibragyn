import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 🔒 Enquanto carrega, NÃO decide nada e NÃO desmonta
  if (isLoading) {
    return children;
  }

  // 🔒 Depois de carregar, decide auth
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
