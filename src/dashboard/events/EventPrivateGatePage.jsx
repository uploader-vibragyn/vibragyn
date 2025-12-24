import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase/client";
import styles from "./EventGuestsPage.module.css";

export default function EventGuestsPage() {
  const { eventId } = useParams();
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadInvites() {
    const { data, error } = await supabase
      .from("event_invites")
      .select("id, email, status, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (!error) setInvites(data || []);
  }

  async function sendInvite() {
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("event_invites").insert({
      event_id: eventId,
      email: email.trim().toLowerCase(),
      invited_by: user.id,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setError("Erro ao enviar convite");
      return;
    }

    setEmail("");
    loadInvites();
  }

  useEffect(() => {
    if (eventId) loadInvites();
  }, [eventId]);

  return (
    <div className={styles.container}>
      <h2>Convidados</h2>

      <div className={styles.inviteBox}>
        <input
          type="email"
          placeholder="Email do convidado"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={sendInvite} disabled={loading || !email}>
          Enviar convite
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {invites.length === 0 ? (
        <p>Nenhum convite enviado ainda.</p>
      ) : (
        <ul className={styles.list}>
          {invites.map((invite) => (
            <li key={invite.id}>
              <strong>{invite.email}</strong>
              <span>{invite.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
