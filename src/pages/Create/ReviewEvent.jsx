// src/pages/Create/ReviewEvent.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Button from "../../components/ui/Button";
import styles from "./ReviewEvent.module.css";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../auth/useAuth";
import { useToast } from "../../hooks/useToast";

export default function ReviewEvent() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const authLoading = auth?.isLoading ?? auth?.loading ?? false;
  const { showToast, ToastComponent } = useToast();

  const state = useMemo(() => {
    if (location.state) return location.state;
    try {
      const raw = sessionStorage.getItem("vg_create_event_draft");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  useEffect(() => {
    if (!state) navigate("/create/visibility", { replace: true });
  }, [state, navigate]);

  async function publish() {
  if (authLoading) return;
  if (!user?.id) {
    navigate("/login", { replace: true });
    return;
  }

  const payload = {
    title: state.title,
    description: state.description,
    event_date: localToUTC(state.event_date),
    category: state.category,
    event_format: state.event_format,
    location: state.location || null,
    online_url: state.online_url || null,
    image_url: state.image_url || null,
    is_paid: !!state.is_paid,
    price: state.is_paid ? Number(state.price) : null,
    is_private: state.is_public === false,
  };

  let error;

 if (state.event_id) {
    // 🔁 UPDATE
    ({ error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", state.event_id)
      .eq("creator_id", user.id));
  } else {
    // 🆕 CREATE
    ({ error } = await supabase.from("events").insert({
      ...payload,
      creator_id: user.id,
      status: "pending",
    }));
  }

  if (error) {
    showToast("Erro ao salvar evento");
    return;
  }

  sessionStorage.removeItem("vg_create_event_draft");
  showToast(state.event_id ? "Evento atualizado ✨" : "Evento criado ✨");

  setTimeout(() => navigate("/"), 800);
}


  if (!state) return null;

  return (
    <div className={styles.container}>
      <div className={styles.processHeader}>
        <div className={styles.processTitle}>Criar evento</div>
        <div className={styles.processStep}>Passo 5 de 5 · Revisão</div>
      </div>

      <h2 className={styles.title}>Revisar evento</h2>

      {state.image_url && (
        <img src={state.image_url} className={styles.cover} alt="capa" />
      )}

      <div className={styles.card}><span>Título</span><p>{state.title}</p></div>
      <div className={styles.card}><span>Descrição</span><p>{state.description}</p></div>
      <div className={styles.card}><span>Data</span><p>{state.event_date}</p></div>
      <div className={styles.card}><span>Categoria</span><p>{state.category}</p></div>
      <div className={styles.card}><span>Formato</span><p>{state.event_format}</p></div>
      <div className={styles.card}><span>Visibilidade</span><p>{state.is_public ? "Público" : "Privado"}</p></div>

      {state.location && (
        <div className={styles.card}><span>Endereço</span><p>{state.location}</p></div>
      )}

      {state.online_url && (
        <div className={styles.card}><span>Link</span><p>{state.online_url}</p></div>
      )}

      <div className={styles.card}>
        <span>Preço</span>
        <p>{state.is_paid ? `R$ ${state.price}` : "Gratuito"}</p>
      </div>

      <div className={styles.buttons}>
  <Button
    onClick={() =>
      navigate("/create/form", {
        state: { ...state, fromReview: true },
      })
    }
  >
    Voltar
  </Button>

  <Button onClick={publish}>Publicar</Button>
</div>


      {ToastComponent}
    </div>
  );
}
