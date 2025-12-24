import { supabase } from "./client";

/**
 * Lista convites de um evento (organizador)
 */
export async function getEventInvites(eventId) {
  const { data, error } = await supabase
    .from("event_invites")
    .select(`
      id,
      email,
      status,
      created_at,
      user_id
    `)
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Convida alguém por email
 */
export async function inviteByEmail(eventId, email) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("event_invites").insert({
    event_id: eventId,
    email,
    invited_by: user.id,
  });

  if (error) throw error;
}

/**
 * Aceitar ou recusar convite
 */
export async function respondToInvite(inviteId, status) {
  if (!["accepted", "declined"].includes(status)) {
    throw new Error("Invalid status");
  }

  const { error } = await supabase
    .from("event_invites")
    .update({ status })
    .eq("id", inviteId);

  if (error) throw error;
}
