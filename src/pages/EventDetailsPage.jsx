import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getEventById,
  canUserAccessEvent,
} from "../supabase/events";

import {
  getUserRsvp,
  setRsvp,
  deleteRsvp,
  getEventAttendance,
} from "../supabase/rsvp";

import styles from "./EventDetailsPage.module.css";
import EventPostFeed from "../components/EventPostFeed";
import Button from "../components/ui/Button";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../auth/useAuth";
import PublicTopBar from "../components/PublicTopBar";



export default function EventDetailsPage() {
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [showAttendees, setShowAttendees] = useState(false);


  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  const [error, setError] = useState(false);

  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const [attendance, setAttendance] = useState({
    going: [],
    maybe: [],
    no: [],
  });

  const { showToast, ToastComponent } = useToast();

  async function loadAttendance(eventId) {
    try {
      const { data } = await getEventAttendance(eventId);
      if (data) {
        setAttendance({
          going: data.going || [],
          maybe: data.maybe || [],
          no: data.no || [],
        });
      }
    } catch (e) {
      console.error("Erro carregando attendance:", e);
    }
  }

  useEffect(() => {
  if (
    !user &&
    !isLoading &&
    !localStorage.getItem("postLoginRedirect")
  ) {
    localStorage.setItem(
      "postLoginRedirect",
      window.location.pathname
    );
  }
}, [user, isLoading]);



 useEffect(() => {
  async function loadEvent() {
    try {
      setLoading(true);

      // 1️⃣ BUSCA O EVENTO (UMA ÚNICA VEZ)
      const { data } = await getEventById(id);
      setEvent(data);

      // 2️⃣ SE USUÁRIO LOGADO, BUSCA RSVP + PRESENÇAS
      if (user) {
        const rsvp = await getUserRsvp(id);
        if (rsvp?.data?.status) {
          setRsvpStatus(rsvp.data.status);
        }

        await loadAttendance(id);
      }

    } catch (err) {
      console.error("Erro ao carregar evento:", err);
    } finally {
      setLoading(false);
    }
  }

  loadEvent();
}, [id, user]);


  // -----------------------
  // ESTADOS DE BLOQUEIO
  // -----------------------

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSkeleton} />
        <div className={styles.loadingContent}>
          <div className={styles.loadingLine} />
          <div className={styles.loadingLineShort} />
        </div>
      </div>
    );
  }

  if (forbidden && !acceptedInvite) {

  const storageKey = `invited_event_${id}`;

  // 🔹 USUÁRIO NÃO LOGADO
  if (!user) {
    return (
      <div className={styles.notFound}>
        <h2>🔒 Evento privado</h2>
        <p>
          Este evento é privado.
          <br />
          Para acessar, entre ou crie uma conta no VibraGyn.
        </p>

        <button
          className={styles.primaryButton}
          onClick={() => {
  localStorage.setItem(
    "postLoginRedirect",
    window.location.pathname
  );
  navigate("/login");
}}

        >
          Entrar para acessar
        </button>
      </div>
    );
  }

  // 🔹 USUÁRIO LOGADO (fluxo que já existia)
  return (
    <div className={styles.notFound}>
      <h2>🔒 Evento privado</h2>
      <p>Você recebeu um convite para este evento.</p>

      <button
  className={styles.primaryButton}
  onClick={() => {
    localStorage.setItem(storageKey, "true");
    setAcceptedInvite(true);
  }}
>
  Entrar no evento
</button>

    </div>
  );
}


  // -----------------------
  // DADOS DERIVADOS
  // -----------------------

  const isOnline = event.event_format === "online";
  const isPaid = Boolean(event.is_paid);
  const hasImage = Boolean(event.image_url);

  const date = event.event_date ? new Date(event.event_date) : null;

  const dateLabel = date
    ? date.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      })
    : "Data a definir";

  const timeLabel = date
    ? date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const priceLabel =
    isPaid && event.price
      ? `R$ ${Number(event.price).toFixed(2).replace(".", ",")}`
      : "Gratuito";

  const goingCount = attendance.going.length;
  const maybeCount = attendance.maybe.length;
  const noCount = attendance.no.length;
  const totalAttendance = goingCount + maybeCount + noCount;

  const mergedAttendees = [
    ...attendance.going,
    ...attendance.maybe,
    ...attendance.no,
  ];

  const MAX_AVATARS = 5;

  const slotsForGuests = Math.max(MAX_AVATARS - 1, 0);

  const slicedGuests = mergedAttendees.slice(0, slotsForGuests);

  const remainingGuests = Math.max(
    mergedAttendees.length - slicedGuests.length,
    0
  );

  const avatarList = slicedGuests;


  // -----------------------
  // RSVP
  // -----------------------

  async function updateRsvp(newStatus) {
    if (!user) {
  showToast("Entre ou crie uma conta para confirmar presença 🔒");
  return;
  }
    if (rsvpLoading) return;
    setRsvpLoading(true);

    try {
      if (newStatus === rsvpStatus) {
        await deleteRsvp(id);
        setRsvpStatus(null);
        showToast("RSVP removido.");
      } else {
        const { error } = await setRsvp(id, newStatus);
        if (!error) {
          setRsvpStatus(newStatus);
          if (newStatus === "going") showToast("Você vai! 🎉");
          if (newStatus === "maybe") showToast("Salvo como 'Talvez' ⭐");
          if (newStatus === "no") showToast("Marcado como 'Não vou'.");
        }
      }

      await loadAttendance(id);
    } catch {
      showToast("Erro ao salvar RSVP.");
    }

    setRsvpLoading(false);
  }

  function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: "Vem comigo nesse evento?",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      showToast("Link copiado 📎");
    }
  }

  // -----------------------
  // RENDER
  // -----------------------

  return (
    <div className={styles.page}>
      <div className={styles.scrollArea}>
    {!user && <PublicTopBar />}

        {/* CAPA */}
        <div className={styles.hero}>
          {hasImage ? (
            <img
              src={event.image_url}
              alt="Capa do evento"
              className={styles.cover}
            />
          ) : (
            <div className={styles.coverPlaceholder}>
              <span className={styles.coverEmoji}>✨</span>
              <span className={styles.coverText}>Evento sem capa</span>
            </div>
          )}

          <div className={styles.heroOverlay}>
  <div className={styles.chipRow}>
    {event.category && (
      <span className={styles.chipCategory}>
        {event.category}
      </span>
    )}

    <span className={styles.chipPrimary}>{dateLabel}</span>

    {timeLabel && (
      <span className={styles.chip}>{timeLabel}</span>
    )}

    <span className={styles.chip}>
      {isOnline ? "Online" : "Presencial"}
    </span>

    <span className={styles.chipPrice}>{priceLabel}</span>
  </div>

  <h1 className={styles.title}>{event.title}</h1>
</div>

        </div>

       {/* RSVP — CTA PRINCIPAL */}
{event?.is_private && !user ? (
  <div className={styles.inviteGateCard}>
    <h3>Você foi convidado para este evento</h3>

    <p>
      Para confirmar presença, comentar ou interagir,
      é necessário entrar ou criar uma conta.
    </p>

    <button
      className={styles.primaryButton}
      onClick={() => {
        localStorage.setItem(
          "postLoginRedirect",
          window.location.pathname + window.location.search
        );
        navigate("/login");
      }}
    >
      Entrar para responder
    </button>
  </div>
) : (
  <div className={styles.rsvpCard}>
    <Button
      onClick={() => updateRsvp("going")}
      disabled={rsvpLoading}
      className={`${styles.rsvpPrimary} ${
        rsvpStatus === "going" ? styles.activeGoing : ""
      }`}
    >
      Eu vou 🔥
    </Button>

    <div className={styles.rsvpSecondaryRow}>
      <Button
        onClick={() => updateRsvp("maybe")}
        disabled={rsvpLoading}
        className={`${styles.rsvpSecondary} ${
          rsvpStatus === "maybe" ? styles.activeMaybe : ""
        }`}
      >
        Talvez ⭐
      </Button>

      <Button
        onClick={() => updateRsvp("no")}
        disabled={rsvpLoading}
        className={`${styles.rsvpSecondary} ${
          rsvpStatus === "no" ? styles.activeNo : ""
        }`}
      >
        Não ❌
      </Button>
    </div>
  </div>
)}


        {/* INFO */}
        <section className={styles.section}>
          <div className={styles.infoCard}>
            <h3 className={styles.sectionTitle}>Onde vai rolar</h3>

            {!isOnline && event.location && (
              <p className={styles.locationRow}>📍 {event.location}</p>
            )}

            {isOnline && event.online_url && (
              <p className={styles.locationRow}>🔗 {event.online_url}</p>
            )}
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.sectionTitle}>Sobre o evento</h3>
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: event.description || "Sem descrição detalhada.",
              }}
            />

          </div>
        </section>

        {/* PRESENÇAS */}
        {totalAttendance > 0 && (
          <section className={styles.section}>
            <div className={styles.attendanceCard}>
              <div className={styles.attendanceCounters}>
                <span>🎉 {goingCount} indo</span>
                <span>⭐ {maybeCount} talvez</span>
                <span>❌ {noCount} não</span>
              </div>

              <div
                className={styles.avatarRow}
                onClick={() => setShowAttendees(true)}
                style={{ cursor: "pointer" }}
              >

                {avatarList.slice(0, 5).map((person, index) => (
                  <div
                    key={person.id ?? `attendee-${index}`}
                    className={styles.avatar}
                    title={person.name}
                    style={{
                      left: `${index * 18}px`,
                      zIndex: 10 - index,
                    }}
                  >
                    {person.avatar_url ? (
                      <img
                        src={person.avatar_url}
                        alt={person.name}
                        className={styles.avatarImg}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{person.initial}</span>
                    )}
                  </div>


                ))}

                {remainingGuests > 0 && (
                  <div className={styles.moreAvatar}>+{remainingGuests}</div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FEED */}
        <EventPostFeed
  eventId={id}
  rsvpStatus={rsvpStatus}
/>


        {/* COMPARTILHAR */}
        <section className={styles.section}>
          <div className={styles.organizerCard}>
            <Button onClick={handleShare} className={styles.shareButton}>
              Compartilhar evento 🔗
            </Button>
          </div>
        </section>

        <div className={styles.bottomSpacer} />
      </div>
        {showAttendees && (
        <div
          className={styles.attendeesOverlay}
          onClick={() => setShowAttendees(false)}
        >
          <div
            className={styles.attendeesModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.attendeesTitle}>
              Quem vai ({attendance.going.length})
            </h3>

            <div className={styles.attendeesList}>
              {attendance.going.map((person, index) => (
                <div
                  key={person.id ?? `attendee-${index}`}
                  className={styles.attendeeItem}
                >
                  <div className={styles.attendeeAvatar}>
                    {person.avatar_url ? (
                      <img
                        src={person.avatar_url}
                        alt={person.name}
                        className={styles.avatarImg}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{person.initial}</span>
                    )}
                  </div>

                  <span className={styles.attendeeName}>
                    {person.name}
                  </span>
                </div>
              ))}
            </div>

            <button
              className={styles.closeButton}
              onClick={() => setShowAttendees(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {ToastComponent}
    </div>
  );
}