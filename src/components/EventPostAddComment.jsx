import { useState } from "react";
import { supabase } from "../supabase/client";
import styles from "../pages/EventDetailsPage.module.css";

export default function EventPostAddComment({ postId, onComment }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!text.trim()) return;
    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSending(false);
      return;
    }

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      text,
      status: "approved", // você pode mudar pra "pending" se quiser moderar comentário também
    });

    if (error) {
      console.error("Erro ao comentar:", error);
    } else {
      setText("");
      onComment && onComment();
    }

    setSending(false);
  }

  return (
    <div className={styles.commentComposer}>
      <input
        className={styles.commentInput}
        type="text"
        placeholder="Escreva um comentário…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={sending}
      />
      <button
        className={styles.commentSend}
        onClick={submit}
        disabled={sending || !text.trim()}
      >
        Enviar
      </button>
    </div>
  );
}
