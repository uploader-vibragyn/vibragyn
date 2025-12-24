import { useAuth } from "../auth/useAuth";
import { supabase } from "../supabase/client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")        // <-- CORRIGIDO!
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile(data);
      } else {
        console.error("Erro carregando perfil:", error);
      }
    }

    loadProfile();
  }, [user]);

  if (!profile) return <p>Carregando...</p>;

  const avatar =
    profile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile?.name || profile?.email || "User"
    )}&background=random&size=256`;

  async function handleDeleteAccount() {
    const really = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita."
    );

    if (!really) return;

    setLoadingDelete(true);

    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      alert("Erro ao excluir conta: " + error.message);
      setLoadingDelete(false);
      return;
    }

    logoutUser();
    alert("Conta excluída com sucesso.");
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 420,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* HEADER FOTO PEQUENA */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img
          src={avatar}
          alt="avatar small"
          width="70"
          height="70"
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Meu Perfil</h2>
          <p style={{ margin: 0, color: "#666" }}>{profile.email}</p>
        </div>
      </div>

      {/* FOTO GRANDE */}
      <div style={{ marginTop: 30, textAlign: "center" }}>
        <img
          src={avatar}
          alt="avatar big"
          width="180"
          height="180"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid #ddd",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <p>
          <strong>Nome:</strong> {profile.name || "Sem nome"}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <button
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "#4A81FF",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Editar Perfil
        </button>

        <button
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "#ff4d4d",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            opacity: loadingDelete ? 0.6 : 1,
          }}
          disabled={loadingDelete}
          onClick={handleDeleteAccount}
        >
          {loadingDelete ? "Excluindo..." : "Excluir Conta"}
        </button>

        <button
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            background: "#ddd",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
          }}
          onClick={logoutUser}
        >
          Sair
        </button>
      </div>
    </div>
  );
}
