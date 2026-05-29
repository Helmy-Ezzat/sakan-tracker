"use server";

import { setUserIdCookie } from "@/lib/auth/cookies";
import {
  ensureSessionMember,
  getOrCreateActiveSession,
} from "@/lib/data/session";
import { normalizePhone, upsertUserByPhone } from "@/lib/data/users";
import { ROUTES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/errors";
import { ar } from "@/lib/i18n/ar";
import { redirect } from "next/navigation";

export type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function loginUser(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));

  if (!name) {
    return { success: false, error: ar.auth.errors.nameRequired };
  }
  if (phone.length < 8) {
    return { success: false, error: ar.auth.errors.phoneInvalid };
  }

  try {
    const user = await upsertUserByPhone(name, phone);
    const session = await getOrCreateActiveSession();
    await ensureSessionMember(session.id, user.id);
    await setUserIdCookie(user.id);
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, ar.auth.errors.signInFailed),
    };
  }

  redirect(ROUTES.dashboard);
}
