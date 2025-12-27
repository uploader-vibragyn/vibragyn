import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔑 ÚNICO redirect permitido após login
  function handlePostLoginRedirect() {
    const redirect = localStorage.getItem("postLoginRedirect");

    if (redirect) {
      localStorage.removeItem("postLoginRedirect");
      navigate(redirect, { replace: true });
    }
    // ⚠️ Se não existir redirect, NÃO navega para /
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }

      handlePostLoginRedirect();
    } catch (err) {
      setError(err?.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      handlePostLoginRedirect();
    } catch (err) {
      setError(err?.message || "Erro ao autenticar com Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>{mode === "login" ? "Entrar" : "Criar conta"}</h2>

        <button
          className={styles.googleButton}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continuar com Google
        </button>

        <div className={styles.divider}>ou</div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading
              ? "Aguarde..."
              : mode === "login"
              ? "Entrar"
              : "Criar conta"}
          </button>
        </form>

        <div className={styles.switch}>
          {mode === "login" ? (
            <>
              Não tem conta?{" "}
              <button type="button" onClick={() => setMode("signup")}>
                Criar agora
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button type="button" onClick={() => setMode("login")}>
                Entrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
