import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventById } from "../../supabase/events";

export default function EventOverviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await getEventById(id);
      setEvent(data);
    }
    load();
  }, [id]);

  if (!event) return <p>Carregando evento…</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>{event.title}</h2>

      <p>
        {event.is_private ? "🔒 Evento privado" : "🌍 Evento público"}
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        {event.is_private && (
          <button
            onClick={() =>
              navigate(`/dashboard/event/${id}/guests`)
            }
          >
            Convidados
          </button>
        )}

        <button
          onClick={() =>
            navigate(`/create/form?edit=${id}`)
          }
        >
          Editar evento
        </button>
      </div>
    </div>
  );
}
