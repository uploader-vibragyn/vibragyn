import { supabase } from "./client";

/**
 * Busca o RSVP do usuário logado
 */
export async function getUserRsvp(eventId) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError || new Error("Usuário não autenticado"),
    };
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  return { data, error };
}

/**
 * Salva RSVP (going / maybe / no)
 */
export async function setRsvp(eventId, status) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: authError };
  }

  const payload = {
    event_id: eventId,
    user_id: user.id,
    status,
  };

  const { data, error } = await supabase
    .from("rsvps")
    .upsert(payload, { onConflict: "event_id,user_id" });

  return { data, error };
}

/**
 * Remove RSVP do usuário
 */
export async function deleteRsvp(eventId) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: authError };
  }

  const { data, error } = await supabase
    .from("rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);

  return { data, error };
}

/**
 * QUEM VAI (padrão Partiful)
 *
 * Retorna:
 * {
 *   going: [ { id, name, avatar_url } ],
 *   maybe: [ ... ],
 *   no:    [ ... ]
 * }
 */
export async function getEventAttendance(eventId) {
  const { data: rows, error } = await supabase
    .from("rsvps")
    .select(
      `
      status,
      user_id,
      profiles:user_id (
        id,
        name,
        avatar_url
      )
    `
    )
    .eq("event_id", eventId);

  if (error) {
    console.error("Erro em getEventAttendance:", error);
    return { data: null, error };
  }

  const groups = {
    going: [],
    maybe: [],
    no: [],
  };

  for (const row of rows || []) {
    const user = {
      id: row.user_id,
      name: row.profiles?.name || "Usuário",
      avatar_url: row.profiles?.avatar_url || null,
    };

    if (row.status === "going") groups.going.push(user);
    if (row.status === "maybe") groups.maybe.push(user);
    if (row.status === "no") groups.no.push(user);
  }

  return { data: groups, error: null };
}
