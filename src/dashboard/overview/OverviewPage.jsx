import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../auth/useAuth";
import "./overview.css";

export default function OverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    eventsCount: 0,
    ticketsCount: 0,
    rsvpsCount: 0,
    checkinsCount: 0,
  });
  const [eventsWithMetrics, setEventsWithMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const creatorId = useMemo(() => user?.id ?? null, [user]);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      if (!creatorId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data: events, error: eventsError } = await supabase
        .from("events")
        .select("id, title, event_date, location, image_url, is_private")
        .eq("creator_id", creatorId)
        .order("event_date", { ascending: true });

      if (cancelled) return;

      if (eventsError) {
        console.error("Erro carregando eventos:", eventsError);
        setLoading(false);
        return;
      }

      const eventIds = (events ?? []).map((e) => e.id);

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

      if (cancelled) return;

      setStats({
        eventsCount: events.length,
        ticketsCount: ticketsCount ?? 0,
        rsvpsCount: rsvpsCount ?? 0,
        checkinsCount: checkinsCount ?? 0,
      });

      // métricas por evento
      const eventsMetrics = await Promise.all(
        events.map(async (ev) => {
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

          return {
            ...ev,
            ticketsCount: tRes.count ?? 0,
            rsvpsCount: rRes.count ?? 0,
            checkinsCount: cRes.count ?? 0,
          };
        })
      );

      if (cancelled) return;

      setEventsWithMetrics(eventsMetrics);
      setLoading(false);
    }

    loadOverview();

    return () => {
      cancelled = true;
    };
  }, [creatorId]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="overview-wrapper">
        <h2 className="overview-title">Visão Geral</h2>
        <p className="no-events">Carregando…</p>
      </div>
    );
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
          <EventPerformanceCard
            key={ev.id}
            event={ev}
            onManage={() => navigate(`/dashboard/event/${ev.id}`)}  // ✅ rota provável correta
            onEdit={() => navigate(`/create/form?edit=${ev.id}`)}
          />
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

function EventPerformanceCard({ event, onManage, onEdit }) {
  const date = event.event_date
    ? new Date(event.event_date).toLocaleDateString("pt-BR")
    : "Sem data";

  return (
    <div className="event-card">
      {event.image_url && (
        <img src={event.image_url} className="event-cover" alt="capa do evento" />
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
        <button type="button" className="event-action-btn" onClick={onManage}>
          Gerenciar evento
        </button>

        <button
          type="button"
          className="event-action-btn secondary"
          onClick={onEdit}
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
