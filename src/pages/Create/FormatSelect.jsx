import { useNavigate, useLocation } from "react-router-dom";
import styles from "./FormatSelect.module.css";

export default function FormatSelect() {
  const navigate = useNavigate();
  const { state } = useLocation();

  function choose(format) {
    navigate("/create/payment", {
      state: {
        ...state,
        event_format: format,
      },
    });
  }

  return (
    <div className={styles.container}>
      {/* HEADER DO PROCESSO */}
      <div className={styles.processHeader}>
        <div className={styles.processTitle}>Criar evento</div>
        <div className={styles.processStep}>Passo 2 de 5 · Formato</div>
      </div>

      {/* CONTEÚDO */}
      <div className={styles.content}>
        <h2 className={styles.title}>Formato do evento</h2>

        <div className={styles.cards}>
          {/* PRESENCIAL */}
          <div
            className={styles.card}
            onClick={() => choose("in_person")}
          >
            <div className={styles.icon}>📍</div>

            <div className={styles.textGroup}>
              <div className={styles.cardTitle}>Presencial</div>
              <div className={styles.cardDescription}>
                As pessoas vão até um local físico.
              </div>
            </div>
          </div>

          {/* ONLINE */}
          <div
            className={styles.card}
            onClick={() => choose("online")}
          >
            <div className={styles.icon}>💻</div>

            <div className={styles.textGroup}>
              <div className={styles.cardTitle}>Online</div>
              <div className={styles.cardDescription}>
                O evento acontece via link de transmissão.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
