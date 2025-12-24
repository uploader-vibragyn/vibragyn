import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/client";
import styles from "./EventGuestsPage.module.css";

export default function EventGuestsPage() {
  const { id } = useParams();
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRsvps() {
      setLoading(true);

      const { data } = await supabase
        .from("rsvps")
        .select(`
          id,
          status,
          users (
            id,
            name,
            email
          )
        `)
        .eq("event_id", id);

      if (data) setRsvps(data);
      setLoading(false);
    }

    fetchRsvps();
  }, [id]);

  const going = rsvps.filter(r => r.status === "going");
  const maybe = rsvps.filter(r => r.status === "maybe");
  const notGoing = rsvps.filter(r => r.status === "not_going");

  const eventLink = `${window.location.origin}/event/${id}`;

  const renderName = item =>
    item.users?.name || item.users?.email || "Usuário";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Convide pessoas</h1>
        <p>Compartilhe o link. Quem abrir pode confirmar presença.</p>

        <button
          className={styles.copyButton}
          onClick={() => navigator.clipboard.writeText(eventLink)}
        >
          Copiar link do evento
        </button>
      </header>

      <section className={styles.listSection}>
        <h2>🔥 Vou ({going.length})</h2>
        {loading ? (
          <p className={styles.muted}>Carregando…</p>
        ) : going.length === 0 ? (
          <p className={styles.muted}>Ninguém confirmou ainda.</p>
        ) : (
          <ul>
            {going.map(item => (
              <li key={item.id}>{renderName(item)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.listSection}>
        <h2>⭐ Talvez ({maybe.length})</h2>
        {maybe.length === 0 ? (
          <p className={styles.muted}>Nenhuma resposta.</p>
        ) : (
          <ul>
            {maybe.map(item => (
              <li key={item.id}>{renderName(item)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.listSection}>
        <h2>❌ Não vou ({notGoing.length})</h2>
        {notGoing.length === 0 ? (
          <p className={styles.muted}>Ninguém recusou.</p>
        ) : (
          <ul>
            {notGoing.map(item => (
              <li key={item.id}>{renderName(item)}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
