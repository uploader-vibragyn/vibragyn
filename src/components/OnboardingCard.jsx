import { useNavigate } from "react-router-dom";
import styles from "./OnboardingCard.module.css";

export default function OnboardingCard() {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        Seu evento. Seus amigos. Do seu jeito.
      </h2>

      <p className={styles.subtitle}>
        Crie eventos, convide quem você quiser e compartilhe experiências.
      </p>

      <button
        className={styles.button}
        onClick={() => navigate("/login")}
      >
        Entrar e descobrir
      </button>
    </div>
  );
}
