import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../auth/useAuth";
import "./overview.css";

export default function OverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [eventsWithMetrics, setEventsWithMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      if (!user) return;

      const creatorId = user.id;

      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, title, event_date, location, image_url, is_private")
        .eq("creator_id", creatorId)
        .order("event_date", { ascending: true });

      if (eventsError) {
        console.error("Erro carregando eventos:", eventsError);
        setLoading(false);
        return;
      }

      const eventIds = events.map((e) => e.id);

      if (eventIds.length === 0) {
        setStats({
          eventsCount: 0,
          ticketsCount: 0,
          rsvpsCount: 0,
          checkinsCount: 0,
        });

        setEventsWithMetrics([]);
        setLoading(false);
        return;
      }

      const [
        { count: ticketsCount },
        { count: rsvpsCount },
        { count: checkinsCount },
      ] = await Promise.all([
        supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .in("event_id", eventIds),

        supabase
          .from("rsvps")
          .select("*", { count: "exact", head: true })
          .in("event_id", eventIds),

        supabase
          .from("checkins")
          .select("*", { count: "exact", head: true })
          .in("event_id", eventIds),
      ]);

      setStats({
        eventsCount: events.length,
        ticketsCount: ticketsCount ?? 0,
        rsvpsCount: rsvpsCount ?? 0,
        checkinsCount: checkinsCount ?? 0,
      });

      const eventsMetrics = [];

      for (const ev of events) {
        const [tRes, rRes, cRes] = await Promise.all([
          supabase
            .from("tickets")
            .select("*", { count: "exact", head: true })
            .eq("event_id", ev.id),

          supabase
            .from("rsvps")
            .select("*", { count: "exact", head: true })
            .eq("event_id", ev.id),

          supabase
            .from("checkins")
            .select("*", { count: "exact", head: true })
            .eq("event_id", ev.id),
        ]);

        eventsMetrics.push({
          ...ev,
          ticketsCount: tRes.count ?? 0,
          rsvpsCount: rRes.count ?? 0,
          checkinsCount: cRes.count ?? 0,
        });
      }

      setEventsWithMetrics(eventsMetrics);
      setLoading(false);
    }

    loadOverview();
  }, [user]);

  if (loading) {
  return null;
}


  return (
    <div className="overview-wrapper">
      <h2 className="overview-title">Visão Geral</h2>

      <div className="stats-grid">
        <StatCard label="Eventos Criados" value={stats.eventsCount} />
        <StatCard label="Ingressos Vendidos" value={stats.ticketsCount} />
        <StatCard label="RSVPs" value={stats.rsvpsCount} />
        <StatCard label="Check-ins" value={stats.checkinsCount} />
      </div>

      <section className="events-section">
        <h3 className="events-section-title">Performance por evento</h3>

        {eventsWithMetrics.length === 0 && (
          <p className="no-events">Você ainda não criou eventos.</p>
        )}

        {eventsWithMetrics.map((ev) => (
          <EventPerformanceCard key={ev.id} event={ev} />
        ))}
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}

function EventPerformanceCard({ event }) {
  const date = event.event_date
    ? new Date(event.event_date).toLocaleDateString("pt-BR")
    : "Sem data";

  return (
    <div className="event-card">
      {event.image_url && (
        <img
          src={event.image_url}
          className="event-cover"
          alt="capa do evento"
        />
      )}

      <div className="event-header">
        <div>
          <p className="event-title">{event.title || "Evento sem título"}</p>
          <p className="event-meta">
            {date} · {event.location || "Local a definir"}
          </p>

          <p className="event-privacy">
            {event.is_private ? "🔒 Privado" : "🌎 Público"}
          </p>
        </div>
      </div>

      <div className="event-metrics-row">
        <MetricPill label="Ingressos" value={event.ticketsCount} />
        <MetricPill label="RSVPs" value={event.rsvpsCount} />
        <MetricPill label="Check-ins" value={event.checkinsCount} />
      </div>

      <div className="event-actions-row">
       <button
          type="button"
          className="event-action-btn"
          onClick={() => {
            window.location.href = `/dashboard/event/${event.id}`;
          }}
        >
          Gerenciar evento
        </button>


        <button
          type="button"
          className="event-action-btn secondary"
          onClick={() => {
            window.location.href = `/create/form?edit=${event.id}`;
          }}
        >
          Editar
        </button>

        
      </div>
    </div>
  );
}

function MetricPill({ label, value }) {
  return (
    <div className="metric-pill">
      <span className="metric-pill-label">{label}</span>
      <span className="metric-pill-value">{value}</span>
    </div>
  );
}
