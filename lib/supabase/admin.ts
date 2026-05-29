import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server operations (bypasses RLS).
 * Requires SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
function getServiceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim()
  );
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = getServiceRoleKey();

  if (!url || !serviceKey) {
    throw new Error(
      "Missing server Supabase key. Add SUPABASE_SERVICE_ROLE_KEY (legacy JWT) or SUPABASE_SECRET_KEY (sb_secret_…) to .env.local — Supabase Dashboard → Project Settings → API Keys → Secret keys.",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
