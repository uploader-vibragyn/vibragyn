import styles from "./EventCard.module.css";

export default function EventCard({ event, onClick }) {
  const isOnline = event.event_format === "online";
  const isPaid = event.is_paid;

  // Formatação de data otimizada: "25 Dez 22:00"
  const dateFormatted = event.event_date
    ? new Date(event.event_date).toLocaleString("pt-BR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).replace(".", "") // Remove pontos de abreviação se houver
        .replace(" de ", " ")
    : "Data a definir";

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
        {/* Tags de status em estilo Pill */}
        <div className={styles.tagsRow}>
          {event.category && (
            <span className={`${styles.tag} ${styles.tagCategory}`}>
              {event.category}
            </span>
          )}
          <span className={styles.tag}>
            {isOnline ? "🌐 Online" : "📍 Presencial"}
          </span>
          <span className={`${styles.tag} ${isPaid ? styles.tagPaid : ""}`}>
            {isPaid ? `R$ ${event.price}` : "Gratuito"}
          </span>
        </div>

        {/* Título com tipografia Inter Bold */}
        <h3 className={styles.title}>{event.title}</h3>

        {/* Informações de Local e Hora com cores da identidade */}
        <div className={styles.infoGroup}>
          <p className={styles.date}>{dateFormatted}</p>
          {!isOnline && event.location_name && (
            <p className={styles.location}>
              <span className={styles.pinIcon}>📍</span> {event.location_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}