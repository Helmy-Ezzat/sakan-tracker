import {
  ROOM_CODE_COOKIE,
  USER_ID_COOKIE,
  USER_ID_COOKIE_MAX_AGE,
} from "@/lib/auth/constants";
import { cookies } from "next/headers";

export async function getUserIdFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(USER_ID_COOKIE)?.value ?? null;
}

export async function setUserIdCookie(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(USER_ID_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: USER_ID_COOKIE_MAX_AGE,
  });
}

export async function clearUserIdCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(USER_ID_COOKIE);
}

export async function getRoomCodeFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ROOM_CODE_COOKIE)?.value ?? null;
}

export async function setRoomCodeCookie(roomCode: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ROOM_CODE_COOKIE, roomCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: USER_ID_COOKIE_MAX_AGE,
  });
}

export async function clearRoomCodeCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ROOM_CODE_COOKIE);
}
