import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase/client";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout() {
  const navigate = useNavigate();
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
      {/* TOPBAR */}
      <header className={styles.topbar}>
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(v => !v)}
        >
          ☰
        </button>
        <span className={styles.logo} onClick={() => go("/feed")}>
          VibraGyn
        </span>
      </header>

      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`${styles.sideMenu} ${menuOpen ? styles.open : ""}`}>
        <button onClick={() => go("/feed")}>Agenda</button>
        <button onClick={() => go("/create/visibility")}>Criar evento</button>
        <button onClick={() => go("/dashboard")}>Meus eventos</button>
        <button onClick={() => go("/profile")}>Perfil</button>

        <div className={styles.spacer} />
        <button className={styles.logout} onClick={handleLogout}>
          Sair
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}
