import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPublicEvents } from "../supabase/events";
import EventCard from "../components/EventCard";
import styles from "./HomePage.module.css";
import PublicTopBar from "../components/PublicTopBar";
import { useAuth } from "../auth/useAuth";
import OnboardingCard from "../components/OnboardingCard";

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔽 ADIÇÃO: categoria selecionada */
  const [selectedCategory, setSelectedCategory] = useState("all");
  /* 🔼 */

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

  /* 🔽 ADIÇÃO: eventos filtrados por categoria */
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((ev) => ev.category === selectedCategory);
  /* 🔼 */

  return (
    <div className={styles.container}>
      {/* TopBar agora flutua em cima de tudo */}
      {!user && <PublicTopBar />}

      <div className={styles.contentWrapper}>
        {/* OnboardingCard precisa ser o primeiro item visual */}
        {!user && <OnboardingCard />}

        {loading && (
          <p className={styles.info}>✨ Carregando sua vibe... ✨</p>
        )}

        {!loading && events.length === 0 && (
          <p className={styles.info}>Nenhum evento encontrado.</p>
        )}

        {/* 🔽 ADIÇÃO: filtro de categorias */}
        {!loading && events.length > 0 && (
          <div className={styles.categoryFilter}>
            <button onClick={() => setSelectedCategory("all")}>
              Todos
            </button>
            <button onClick={() => setSelectedCategory("party")}>
              Festa
            </button>
            <button onClick={() => setSelectedCategory("show")}>
              Show
            </button>
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
            <button onClick={() => setSelectedCategory("art")}>
              Arte
            </button>
            <button onClick={() => setSelectedCategory("culture")}>
              Cultura
            </button>
             <button onClick={() => setSelectedCategory("teather")}>
              Teatro
            </button>
          </div>
        )}
        {/* 🔼 */}

        <div className={styles.list}>
          {/* 🔽 ÚNICA TROCA: usar filteredEvents */}
          {filteredEvents.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onClick={() => navigate(`/event/${ev.id}`)}
            />
          ))}
          {/* 🔼 */}
        </div>
      </div>
    </div>
  );
}
