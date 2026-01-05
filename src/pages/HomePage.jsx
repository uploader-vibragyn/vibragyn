import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listPublicEvents } from "../supabase/events";
import EventCard from "../components/EventCard";
import styles from "./HomePage.module.css";
import PublicTopBar from "../components/PublicTopBar";
import { useAuth } from "../auth/useAuth";
import OnboardingCard from "../components/OnboardingCard";

const PAGE_SIZE = 5;

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
              <EventCard
                event={ev}
                onClick={() => navigate(`/event/${ev.id}`)}
              />
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
