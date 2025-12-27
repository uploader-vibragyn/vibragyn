import { supabase } from "../supabase/client";

/* LOGIN COM GOOGLE */
export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    throw error;
  }
}

/* LOGIN COM EMAIL/SENHA */
export async function loginWithEmail(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }
}

/* LOGOUT */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
