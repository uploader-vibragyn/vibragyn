import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listPublicEvents } from "../supabase/events";
import EventCard from "../components/EventCard";
import styles from "./HomePage.module.css";
import PublicTopBar from "../components/PublicTopBar";
import { useAuth } from "../auth/useAuth";
import OnboardingCard from "../components/OnboardingCard";

const PAGE_SIZE = 6;

const CATEGORY_LABELS = {
  all: "Todos",
  party: "Festa",
  show: "Show",
  birthday: "Aniversário",
  class: "Aulas & Cursos",
  workshop: "Workshop",
  sport: "Esporte",
  art: "Arte",
  culture: "Cultura",
  teather: "Teatro",
};


/* 🔽 ADIÇÃO NECESSÁRIA — NORMALIZA DATA, HORA E LOCAL */
function normalizeEvent(ev) {
  let date_label = "";
  let time_label = "";

 if (ev.event_date) {
  const d = new Date(ev.event_date);

  date_label = d
  .toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  })
  .replace("de ", "")   // remove o "de"
  .replace(".", "");    // remove ponto do mês


  time_label = d
    .toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":00", "h")
    .replace(":", "h"); // transforma 16:00 → 16h | 16:30 → 16h30
}


  return {
  ...ev,
  date_label,
  time_label,
  venue_name: ev.location || "",
  city: ev.city || "",

  // 🔽 categoria traduzida para UI
  category: CATEGORY_LABELS[ev.category] || ev.category,
};
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔽 filtro */
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* 🔽 paginação */
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      const { data, error } = await listPublicEvents();
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  /* 🔽 filtro */
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((ev) => ev.category === selectedCategory);

  /* 🔽 eventos visíveis */
  const visibleEvents = filteredEvents.slice(0, visibleCount);

  /* 🔽 infinite scroll */
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [filteredEvents]);

  return (
    <div className={styles.container}>
      {!user && <PublicTopBar />}

      <div className={styles.contentWrapper}>
        {!user && (
          <div className={styles.onboardingSlot}>
            <OnboardingCard />
          </div>
        )}

        {loading && (
          <p className={styles.info}>✨ Carregando sua vibe... ✨</p>
        )}

        {!loading && events.length === 0 && (
          <p className={styles.info}>Nenhum evento encontrado.</p>
        )}

        {!loading && events.length > 0 && (
          <div className={styles.categoryFilter}>
            <button onClick={() => setSelectedCategory("all")}>Todos</button>
            <button onClick={() => setSelectedCategory("party")}>Festa</button>
            <button onClick={() => setSelectedCategory("show")}>Show</button>
            <button onClick={() => setSelectedCategory("birthday")}>
              Aniversário
            </button>
            <button onClick={() => setSelectedCategory("class")}>
              Aulas-Cursos
            </button>
            <button onClick={() => setSelectedCategory("workshop")}>
              Workshop
            </button>
            <button onClick={() => setSelectedCategory("sport")}>
              Esporte
            </button>
            <button onClick={() => setSelectedCategory("art")}>Arte</button>
            <button onClick={() => setSelectedCategory("culture")}>
              Cultura
            </button>
            <button onClick={() => setSelectedCategory("teather")}>
              Teatro
            </button>
          </div>
        )}

        <div className={styles.list}>
          {visibleEvents.map((ev, index) => (
            <div
              key={ev.id}
              className={styles.cardWrapper}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* 🔽 ÚNICA MUDANÇA AQUI */}
              <EventCard event={normalizeEvent(ev)} />
            </div>
          ))}
        </div>

        {/* 🔽 sentinel do infinite scroll */}
        {visibleCount < filteredEvents.length && (
          <div ref={loadMoreRef} className={styles.loadMore} />
        )}
      </div>
    </div>
  );
}
