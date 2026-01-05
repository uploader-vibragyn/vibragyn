import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "../components/Navbar";
import PublicTopBar from "../components/PublicTopBar";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <div className={styles.app}>
      {user ? <Navbar /> : <PublicTopBar />}

      {/* 🔥 ESSENCIAL */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
