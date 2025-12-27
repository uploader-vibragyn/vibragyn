import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPublicEvents } from "../supabase/events";
import EventCard from "../components/EventCard";
import styles from "./HomePage.module.css";
import { supabase } from "../supabase/client";
import PublicTopBar from "../components/PublicTopBar";
import { useAuth } from "../auth/useAuth";
import OnboardingCard from "../components/OnboardingCard";



export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();


  async function handleLogout() {
    await supabase.auth.signOut({ scope: "global" });
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  }

  useEffect(() => {
    async function load() {
      const { data, error } = await listPublicEvents();
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className={styles.container}>
  
  {!user && <PublicTopBar />}
  
  {!user && <OnboardingCard />}



      {loading && (
        <p className={styles.info}>Carregando eventos...</p>
      )}

      {!loading && events.length === 0 && (
        <p className={styles.info}>Nenhum evento aprovado ainda.</p>
      )}

      <div className={styles.list}>
        {events.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            onClick={() => navigate(`/event/${ev.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
