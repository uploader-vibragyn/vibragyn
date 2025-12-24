import { supabase } from "../supabase/client";

export async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Erro ao fazer signOut:", err);
  }

  try {
    // limpa qualquer token que o supabase possa ter guardado
    localStorage.clear();
    sessionStorage.clear();
  } catch (err) {
    console.error("Erro limpando storage:", err);
  }

  // redireciona SEM DEPENDER de estado de React
  window.location.href = "/login";
}
