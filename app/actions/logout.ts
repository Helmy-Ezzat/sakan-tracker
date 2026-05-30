"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { ROOM_CODE_COOKIE, USER_ID_COOKIE } from "@/lib/auth/constants";

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete(USER_ID_COOKIE);
  cookieStore.delete(ROOM_CODE_COOKIE);
  
  redirect(ROUTES.login);
}
