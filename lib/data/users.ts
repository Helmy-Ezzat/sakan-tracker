import { createAdminClient } from "@/lib/supabase/admin";
import type { User, UserRole } from "@/types/database";

function normalizeUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    name: row.name as string,
    phone_number: row.phone_number as string,
    role: ((row.role as UserRole | undefined) ?? "user") as UserRole,
    room_code: row.room_code as string,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}

export async function upsertUserByPhone(
  name: string,
  phone: string,
  roomCode: string,
): Promise<User> {
  const supabase = createAdminClient();
  const phone_number = normalizePhone(phone);

  const { data: existing, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", phone_number)
    .eq("room_code", roomCode)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    if (existing.name.trim() !== name.trim()) {
      const { data: updated, error: updateError } = await supabase
        .from("users")
        .update({ name: name.trim() })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return normalizeUser(updated);
    }
    return normalizeUser(existing);
  }

  const { data: created, error: insertError } = await supabase
    .from("users")
    .insert({ name: name.trim(), phone_number, room_code: roomCode })
    .select()
    .single();

  if (insertError) throw insertError;
  return normalizeUser(created);
}

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data ? normalizeUser(data) : null;
}
