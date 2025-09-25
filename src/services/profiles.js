import { supabase } from "./supabase";

export async function getProfileFromDB(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ?? null;
}

export async function upsertProfileFromSession(user) {
  if (!user) return null;
  const { id, email, user_metadata } = user;
  const role = user_metadata.role ?? null;
  const display_name = user_metadata?.display_name ?? email;

  let { data, error } = await supabase
    .from("profiles")
    .upsert([{ id, display_name, role }], { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
