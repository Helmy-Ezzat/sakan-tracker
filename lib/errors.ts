type PostgrestErrorLike = {
  message?: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

function isPostgrestError(err: unknown): err is PostgrestErrorLike {
  return (
    typeof err === "object" &&
    err !== null &&
    "message" in err &&
    typeof (err as PostgrestErrorLike).message === "string"
  );
}

import { ar } from "@/lib/i18n/ar";

/** User-facing message from Supabase/PostgREST or standard errors. */
export function getErrorMessage(err: unknown, fallback: string): string {
  if (isPostgrestError(err)) {
    if (err.code === "PGRST205") {
      return ar.errors.dbNotSetup;
    }
    if (err.code === "42P01") {
      return ar.errors.tableMissing;
    }
    return err.hint ? `${err.message} (${err.hint})` : err.message!;
  }

  if (err instanceof Error) {
    const msg = err.message;
    if (msg === "forbidden") return ar.dashboard.errors.deleteForbidden;
    if (msg === "expense_not_found") return ar.dashboard.errors.deleteNotFound;
    if (msg === "session_not_active") return ar.dashboard.errors.noActiveSession;
    return msg || fallback;
  }

  return fallback;
}
