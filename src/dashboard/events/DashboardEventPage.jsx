import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import EventGuestsPage from "./EventGuestsPage";
import styles from "./DashboardEventPage.module.css";

export default function DashboardEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      const { data } = await supabase
        .from("events")
        .select("id, title, is_private")
        .eq("id", id)
        .single();

      setEvent(data);
      setLoading(false);
    }

    loadEvent();
  }, [id]);

  if (loading) return <p style={{ padding: 24 }}>Carregando…</p>;
  if (!event) return <p style={{ padding: 24 }}>Evento não encontrado.</p>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/dashboard")}>
          ← Meus eventos
        </button>

        <h1 className={styles.title}>{event.title}</h1>

        {event.is_private && (
          <span className={styles.badge}>Evento privado</span>
        )}
      </header>

      {/* CONTEÚDO ÚNICO DO MVP */}
      <EventGuestsPage />
    </div>
  );
}
