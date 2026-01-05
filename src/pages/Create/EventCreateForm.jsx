// src/pages/Create/EventCreateForm.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { supabase } from "../../supabase/client";
import { useAuth } from "../../auth/useAuth";
import styles from "./EventCreateForm.module.css";

/* 🔽 ADIÇÃO (PRO, sem bug) */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
/* 🔼 ADIÇÃO */

function toast(msg) {
  const div = document.createElement("div");
  div.className = styles.toast;
  div.innerText = msg;

  document.body.appendChild(div);

  setTimeout(() => div.classList.add(styles.toastShow), 10);
  setTimeout(() => {
    div.classList.remove(styles.toastShow);
    setTimeout(() => div.remove(), 250);
  }, 2300);
}

export default function EventCreateForm() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const authLoading = auth?.isLoading ?? auth?.loading ?? false;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("party");
  const [locationField, setLocationField] = useState("");
  const [onlineUrl, setOnlineUrl] = useState("");
  const [price, setPrice] = useState("");

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (state?.fromReview === true) {
      setTitle(state.title || "");
      setDescription(state.description || "");
      setEventDate(state.event_date || "");
      setCategory(state.category || "party");
      setLocationField(state.location || "");
      setOnlineUrl(state.online_url || "");
      setPrice(state.price || "");
      setPreviewUrl(state.image_url || null);
    }
  }, [state]);

  /* 🔽 ADIÇÃO (editor real, sem bug de cursor) */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: description || "",
    onUpdate({ editor }) {
      setDescription(editor.getHTML());
    },
  });
  /* 🔼 ADIÇÃO */

  function handleFileChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function uploadImage() {
    if (!file && previewUrl) return previewUrl;
    if (!file) return null;
    if (!user?.id) {
      toast("Sua sessão ainda está carregando. Tente novamente.");
      return null;
    }
    const fileName = `${user.id}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("event-images")
      .upload(fileName, file);
    if (error) {
      toast("Erro ao subir imagem.");
      return null;
    }
    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(fileName);
    return urlData?.publicUrl || null;
  }

  async function goToReview() {
    if (isSaving) return;
    if (authLoading) return toast("Carregando sessão... tente de novo.");
    if (!user?.id) {
      toast("Você precisa estar logado para criar evento.");
      navigate("/login", { replace: true });
      return;
    }
    if (!title) return toast("Título obrigatório.");
    if (!eventDate) return toast("Data obrigatória.");
    if (state?.event_format === "in_person" && !locationField)
      return toast("Endereço obrigatório.");
    if (state?.event_format === "online" && !onlineUrl)
      return toast("Link obrigatório.");
    if (state?.is_paid && (!price || Number(price) <= 0))
      return toast("Preço inválido.");

    setIsSaving(true);
    const finalImageUrl = await uploadImage();
    if (!finalImageUrl) {
      setIsSaving(false);
      return toast("Escolha uma imagem válida.");
    }

    const draft = {
      title,
      description,
      event_date: eventDate,
      category,
      location: locationField,
      online_url: onlineUrl,
      price,
      is_paid: !!state?.is_paid,
      is_public: state?.is_public,
      event_format: state?.event_format,
      image_url: finalImageUrl,
    };
    sessionStorage.setItem("vg_create_event_draft", JSON.stringify(draft));

    navigate("/create/review", {
      state: { ...draft, fromReview: true },
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.processHeader}>
        <div className={styles.processTitle}>Criar evento</div>
        <div className={styles.processStep}>Passo 4 de 5 · Detalhes</div>
      </div>

      <h2 className={styles.title}>Detalhes do evento</h2>

      <div className={styles.card}>
        <input
          className={styles.input}
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* 🔽 ÚNICA TROCA VISUAL/FUNCIONAL */}
      <div className={styles.card}>
        <EditorContent
          editor={editor}
          className={styles.descriptionInput}
        />
      </div>
      {/* 🔼 */}

      <div className={styles.card}>
        <input
          className={styles.input}
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>

      <div className={styles.card}>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="party">Festa</option>
          <option value="show">Show</option>
          <option value="teather">Teatro</option>
          <option value="birthday">Aniversário</option>
          <option value="class">Aulas-Cursos</option>
          <option value="workshop">workshop</option>
          <option value="sport">Esporte</option>
          <option value="art">Arte</option>
          <option value="culture">Cultura</option>
        </select>
      </div>

      {state?.event_format === "in_person" && (
        <div className={styles.card}>
          <input
            className={styles.input}
            placeholder="Endereço"
            value={locationField}
            onChange={(e) => setLocationField(e.target.value)}
          />
        </div>
      )}

      {state?.event_format === "online" && (
        <div className={styles.card}>
          <input
            className={styles.input}
            placeholder="URL da transmissão"
            value={onlineUrl}
            onChange={(e) => setOnlineUrl(e.target.value)}
          />
        </div>
      )}

      {state?.is_paid && (
        <div className={styles.card}>
          <input
            className={styles.input}
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      )}

      <div className={styles.card}>
        <label className={styles.fileLabel}>
          {previewUrl ? (
            <img src={previewUrl} className={styles.preview} alt="preview" />
          ) : (
            "Escolha uma imagem de capa"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </label>
      </div>

      <Button onClick={goToReview} disabled={isSaving}>
        {isSaving ? "Processando..." : "Revisar evento"}
      </Button>
    </div>
  );
}
