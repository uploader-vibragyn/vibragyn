import { supabase } from "../supabase/client";

// -- GARANTE PERFIL NO SUPABASE
export async function ensureUserProfile(user) {
  if (!user) return;

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existing) {
    await supabase
      .from("profiles")
      .update({
        email: user.email,
        name: existing.name || user.email.split("@")[0],
        avatar_url: existing.avatar_url || null,
        role: existing.role || "user",
      })
      .eq("id", user.id);

    return;
  }

  await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    name: user.email.split("@")[0],
    avatar_url: null,
    role: "user",
    created_at: new Date().toISOString(),
  });
}


// -- LOGIN EMAIL + SENHA
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { user: null };

  await ensureUserProfile(data.user);
  return { user: data.user };
}

// -- LOGIN GOOGLE
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) return { user: null };

  return { user: data };
}

// -- LOGIN APPLE
export async function loginWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
  });

  if (error) return { user: null };

  return { user: data };
}

// -- LOGOUT COMPLETO
export async function logoutUser() {
  await supabase.auth.signOut({ scope: "global" });
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "/login";
}
