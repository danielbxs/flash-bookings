import { toCents } from "../utils/utils";
import { supabase } from "./supabase";

export async function createService(serviceObj) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const isOwner = user?.user_metadata?.role === "owner";

  if (!isOwner) {
    throw new Error("Forbidden access");
  }

  const rowObj = {
    owner_id: userId,
    name: serviceObj.name,
    description: serviceObj.description || null,
    duration_minutes: serviceObj.duration,
    price_cents: toCents(serviceObj.price),
    active: serviceObj.active ?? true,
  };

  let { data, error } = await supabase
    .from("services")
    .insert([rowObj])
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getServiceById(serviceId) {
  let { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listServices(
  q,
  ownerId,
  activeOnly = true,
  limit = 20,
  cursor
) {
  const pageSize = Math.max(1, Math.min(Number(limit) || 20, 50));
  let query = supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeOnly) query = query.eq("active", true);
  if (ownerId) query = query.eq("owner_id", ownerId);
  if (q && q.trim()) {
    const term = q.trim();
    query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  if (cursor) query = query.lt("created_at", cursor);
  query = query.limit(pageSize);

  let { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listMyServices(activeOnly = true, limit = 20, cursor) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return listServices(null, user.id, activeOnly, limit, cursor);
}

export async function updateService(serviceId, serviceObj) {
  const patch = {};
  if ("name" in serviceObj) patch.name = serviceObj.name;
  if ("description" in serviceObj)
    patch.description = serviceObj.description ?? null;
  if ("duration" in serviceObj) patch.duration_minutes = serviceObj.duration;
  if ("price" in serviceObj) patch.price_cents = toCents(serviceObj.price);
  if ("active" in serviceObj) patch.active = !!serviceObj.active;

  if (Object.keys(patch).length === 0) {
    return getServiceById(serviceId);
  }

  let { data, error } = await supabase
    .from("services")
    .update(patch)
    .eq("id", serviceId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function setServiceActive(serviceId, isActive) {
  let { data, error } = await supabase
    .from("services")
    .update({ active: isActive })
    .eq("id", serviceId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteService(serviceId) {
  let { error } = await supabase.from("services").delete().eq("id", serviceId);

  if (error) {
    throw new Error(error.message);
  }

  return;
}

export async function getServicesCount(q, ownerId, activeOnly) {
  let query = supabase
    .from("services")
    .select("id", { count: "exact", head: true });

  if (activeOnly !== false) query = query.eq("active", true);

  if (ownerId) query = query.eq("owner_id", ownerId);

  if (q && q.trim()) {
    const term = q.trim();
    query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  let { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function isOwnerOfService(serviceId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  let { data, error } = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return !!data;
}
