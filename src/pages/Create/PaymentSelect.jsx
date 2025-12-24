// src/pages/Create/PaymentSelect.jsx
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./PaymentSelect.module.css";

export default function PaymentSelect() {
  const navigate = useNavigate();
  const { state } = useLocation();

  function choose(isPaid) {
    navigate("/create/form", {
      state: {
        ...state,
        is_paid: isPaid,
      },
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.processHeader}>
        <div className={styles.processTitle}>Criar evento</div>
        <div className={styles.processStep}>Passo 3 de 5 · Pagamento</div>
      </div>

      <div className={styles.content}>
        <div className={styles.title}>O evento será...</div>

        <div className={styles.cards}>
          <div className={styles.card} onClick={() => choose(false)}>
            <span className={styles.icon}>✨</span>
            <div className={styles.textGroup}>
              <div className={styles.cardTitle}>Gratuito</div>
              <div className={styles.cardDescription}>
                As pessoas entram sem pagar nada.
              </div>
            </div>
          </div>

          <div className={styles.card} onClick={() => choose(true)}>
            <span className={styles.icon}>💰</span>
            <div className={styles.textGroup}>
              <div className={styles.cardTitle}>Pago</div>
              <div className={styles.cardDescription}>
                Os participantes compram ingresso.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
