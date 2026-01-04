import { useNavigate } from "react-router-dom";
import styles from "./OnboardingCard.module.css";

export default function OnboardingCard() {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        Seu evento.<br/>Seus amigos.<br/>Do seu jeito.
      </h2>

      <p className={styles.subtitle}>
        Crie momentos inesquecíveis e compartilhe experiências únicas.
      </p>

      <button
        className={styles.button}
        onClick={() => navigate("/login")}
      >
        Entrar e Descobrir ✨
      </button>
    </div>
  );
}