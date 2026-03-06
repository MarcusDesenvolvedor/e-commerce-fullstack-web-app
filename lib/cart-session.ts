import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const CART_SESSION_COOKIE = "cart_session_id";

export async function getOrCreateCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;

  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set(CART_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return sessionId;
}
