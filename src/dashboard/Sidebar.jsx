import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const Item = ({ to, label }) => (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "14px 18px",
        borderRadius: 8,
        marginBottom: 6,
        textDecoration: "none",
        background: pathname === to ? "#e6ecff" : "transparent",
        color: pathname === to ? "#2a4bff" : "#333",
        fontWeight: 500,
      }}
    >
      {label}
    </Link>
  );

  return (
    <aside
      style={{
        width: 220,
        background: "white",
        borderRight: "1px solid #ddd",
        padding: 20,
        fontFamily: "system-ui",
      }}
    >
      <h3 style={{ marginBottom: 20 }}>Dashboard</h3>

      <Item to="/dashboard/overview" label="Overview" />
      <Item to="/dashboard/events" label="Eventos" />
      <Item to="/dashboard/tickets" label="Ingressos" />
      <Item to="/dashboard/guests" label="Convidados" />
    </aside>
  );
}
