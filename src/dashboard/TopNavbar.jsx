import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import { useAuth } from "../auth/useAuth";

export default function TopNavbar({ hasEvents }) {
  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) return null;

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "8px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <NavLink to="/dashboard">Home</NavLink>
        <NavLink to="/dashboard/create">Criar</NavLink>
        {hasEvents && <NavLink to="/dashboard">Eventos</NavLink>}
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <NavLink to="/dashboard/profile">Perfil</NavLink>
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "#111",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
