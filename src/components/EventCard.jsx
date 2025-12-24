import styles from "./EventCard.module.css";

export default function EventCard({ event, onClick }) {
  const isOnline = event.event_format === "online";
  const isPaid = event.is_paid;

  // Formato solicitado: 25 Dez 22:00
  const dateFormatted = event.event_date
    ? new Date(event.event_date).toLocaleString("pt-BR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(" de ", " ") // Remove o "de" para ficar "25 Dez"
    : "";

  const placeholder = "/placeholder-event.png";

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img
          src={event.image_url || placeholder}
          alt={event.title}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.tagsRow}>
          {/* Pill de Categoria solicitado */}
          {event.category && (
            <span className={`${styles.tag} ${styles.tagCategory}`}>
              {event.category}
            </span>
          )}
          <span className={styles.tag}>{isOnline ? "🌐 Online" : "📍 Presencial"}</span>
          <span className={`${styles.tag} ${isPaid ? styles.tagPaid : styles.tagFree}`}>
            {isPaid ? `R$ ${event.price}` : "Gratuito"}
          </span>
        </div>

        <h3 className={styles.title}>{event.title}</h3>

        <div className={styles.infoGroup}>
          <p className={styles.date}>{dateFormatted}</p>
          {!isOnline && event.location && (
            <p className={styles.location}>
              <strong>Local:</strong> {event.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}