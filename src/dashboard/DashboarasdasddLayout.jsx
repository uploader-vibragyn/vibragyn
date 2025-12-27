import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase/client";
import { useAuth } from "../auth/useAuth";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);


  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/", { replace: true });

  }

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <div className={styles.wrapper}>
      {/* TOP BAR */}
      <header className={styles.topbar}>
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          ☰
        </button>
        <span className={styles.logo}>VibraGyn</span>
      </header>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDE MENU */}
      <aside
        className={`${styles.sideMenu} ${menuOpen ? styles.open : ""}`}
      >
        <button className={styles.menuItem} onClick={() => go("/feed")}>
          Agenda
        </button>

        <button className={styles.menuItem} onClick={() => go("/create/visibility")}>
          Criar evento
        </button>

        <button className={styles.menuItem} onClick={() => go("/dashboard")}>
          Meus eventos
        </button>

        <button className={styles.menuItem} onClick={() => go("/profile")}>
          Perfil
        </button>

        <div className={styles.spacer} />

        <button className={styles.logout} onClick={handleLogout}>
          Sair
        </button>
      </aside>

      {/* CONTENT (único que rola) */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
