import { useNavigate, useLocation } from "react-router-dom";
import styles from "./VisibilitySelect.module.css";

export default function VisibilitySelect() {
  const navigate = useNavigate();
  const { state } = useLocation();

  function choose(visibility) {
    navigate("/create/format", {
      state: {
        ...state,
        event_visibility: visibility,
      },
    });
  }

  return (
    <div className={styles.container}>
      {/* HEADER DO PROCESSO */}
      <div className={styles.processHeader}>
        <div className={styles.processTitle}>Criar evento</div>
        <div className={styles.processStep}>
          Passo 1 de 5 · Visibilidade
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className={styles.content}>
        <h2 className={styles.title}>Quem poderá ver seu evento?</h2>

        <div className={styles.cards}>
          {/* EVENTO PÚBLICO */}
          <div
            className={styles.card}
            onClick={() => choose("public")}
          >
            <div className={styles.icon}>🌍</div>

            <div className={styles.textGroup}>
              <div className={styles.cardTitle}>Evento público</div>
              <div className={styles.cardDescription}>
                Qualquer pessoa pode participar do evento.
              </div>
            </div>
          </div>

          {/* EVENTO PRIVADO */}
          <div
            className={styles.card}
            onClick={() => choose("private")}
          >
            <div className={styles.icon}>🔒</div>

            <div className={styles.textGroup}>
              <div className={styles.cardTitle}>Evento privado</div>
              <div className={styles.cardDescription}>
                Apenas acesso com Link Privado.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
