import AppRouter from "./router/AppRouter";
import { useAuth } from "./auth/useAuth";

export default function App() {
  const { loading } = useAuth();

  if (loading) return null;

  return <AppRouter />;
}
