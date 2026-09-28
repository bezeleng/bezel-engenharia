import { NextResponse } from "next/server";
import { EMAIL_SESSION_COOKIE } from "@/lib/email-panel-session";

export async function POST() {
  const response = NextResponse.json({ sucesso: true });
  response.cookies.set(EMAIL_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
