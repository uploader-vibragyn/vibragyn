import styles from "./InviteCenter.module.css";

function buildMessage(event, url) {
  return `🎉 Você foi convidado(a)!

Evento: ${event.title}
📅 ${event.date || ""}
📍 ${event.location || ""}

Confirme sua presença:
${url}

VibraGyn`;
}

export default function InviteCenter({ event, invites }) {
  const eventUrlBase = `${window.location.origin}/event/${event.id}`;

  function openWhatsApp(message) {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function openTelegram(message, url) {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function copyMessage(message) {
    navigator.clipboard.writeText(message);
    alert("Convite copiado");
  }

  return (
    <div className={styles.card}>
      <h3>Central de Convites</h3>

      {invites.length === 0 && (
        <p className={styles.empty}>Nenhum convidado ainda</p>
      )}

      {invites.map((invite) => {
        const url = `${eventUrlBase}?invite=${invite.token}`;
        const message = buildMessage(event, url);

        return (
          <div key={invite.id} className={styles.inviteRow}>
            <div className={styles.info}>
              <strong>{invite.guest_name || "Sem nome"}</strong>
              <span className={styles.status}>{invite.status}</span>
            </div>

            <div className={styles.actions}>
              <button onClick={() => openWhatsApp(message)}>WhatsApp</button>
              <button onClick={() => openTelegram(message, url)}>
                Telegram
              </button>
              <button onClick={() => copyMessage(message)}>
                Copiar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
