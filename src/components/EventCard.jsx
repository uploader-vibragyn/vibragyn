import styles from "./EventCard.module.css";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const location =
    event.venue_name && event.city
      ? `${event.venue_name}, ${event.city}`
      : event.city || event.venue_name || "";

  const dateTime =
    event.date_label && event.time_label
      ? `${event.date_label} • ${event.time_label}`
      : event.date_label || "";

  return (
    <Link to={`/event/${event.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={event.image_url}
          alt={event.title}
          loading="lazy"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.topLine}>
          {event.category && (
            <div className={styles.category}>
              {event.category}
            </div>
          )}

          {event.is_paid && event.price ? (
            <div className={styles.price}>
              R$ {event.price}
            </div>
          ) : (
            <div className={styles.price}>
              Gratuito
            </div>
          )}
        </div>

        <h3 className={styles.title}>{event.title}</h3>

        {/* DATA E HORA — NÃO ESQUECIDO */}
        {dateTime && (
          <div className={styles.datetime}>
            {dateTime}
          </div>
        )}

        {/* LOCAL */}
        {location && (
          <div className={styles.location}>
            {location}
          </div>
        )}
      </div>
    </Link>
  );
}
