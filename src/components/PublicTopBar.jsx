import { useNavigate } from "react-router-dom";
import styles from "./PublicTopBar.module.css";

export default function PublicTopBar() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <button className={styles.back} onClick={() => navigate("/")}>
        Agenda
      </button>

      <button className={styles.brand} onClick={() => navigate("/")}>
        VibraGyn
      </button>

      <button className={styles.login} onClick={() => navigate("/login")}>
        Entrar
      </button>
    </div>
  );
}
