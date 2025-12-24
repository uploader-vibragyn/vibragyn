import { supabase } from "../supabase/client";

export async function ensureUserProfile(user) {
  if (!user) return;

  const { id, email, user_metadata } = user;

  const avatarUrl =
    user_metadata?.avatar_url ||
    user_metadata?.picture ||
    null;

  const fullName =
    user_metadata?.full_name ||
    user_metadata?.name ||
    email?.split("@")[0];

  // verifica se já existe
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", id)
    .single();

  if (existing) return;

  // cria perfil
  await supabase.from("users").insert({
    id,
    email,
    name: fullName,
    avatar_url: avatarUrl,
  });
}
