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

  // ✅ USADO APENAS PARA EMAIL/SENHA
  function handlePostLoginRedirect() {
    const redirect = localStorage.getItem("postLoginRedirect");

    if (redirect) {
      localStorage.removeItem("postLoginRedirect");
      navigate(redirect, { replace: true });
    }
  }

  // EMAIL / SENHA
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

      handlePostLoginRedirect(); // ✅ AQUI PODE
    } catch (err) {
      setError(err?.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  // 🔴 GOOGLE LOGIN — NÃO USA REDIRECT REACT
  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      // ❌ NÃO chama handlePostLoginRedirect
      // ❌ NÃO chama navigate
      // OAuth vai redirecionar sozinho via redirectTo
    } catch (err) {
      setError(err?.message || "Erro ao autenticar com Google");
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
