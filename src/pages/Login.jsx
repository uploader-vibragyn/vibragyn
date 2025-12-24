import React, { useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    const { error } = await loginWithGoogle();
    if (error) setError(error.message);

    setLoading(false);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { user, error } = await loginWithEmail(email, password);

    if (error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
      return;
    }

    if (user) navigate("/", { replace: true });

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h1>Login</h1>

      {error && (
        <div style={{
          padding: 10,
          background: "#ffebee",
          color: "#c62828",
          borderRadius: 6,
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 20px",
          background: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 16,
          marginBottom: 20,
        }}
      >
        {loading ? "Processando..." : "Login com Google"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
