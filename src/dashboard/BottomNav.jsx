import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function BottomNav() {
  const { pathname } = useLocation();
  const { loading } = useAuth();

  if (loading) return null;

  const Item = ({ to, label }) => (
    <Link
      to={to}
      className={pathname === to ? "bottom-item active" : "bottom-item"}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bottom-nav">
      <Item to="/dashboard/overview" label="Overview" />
      <Item to="/dashboard/events" label="Eventos" />
      <Item to="/dashboard/tickets" label="Ingressos" />
      <Item to="/dashboard/guests" label="Convidados" />
    </nav>
  );
}
