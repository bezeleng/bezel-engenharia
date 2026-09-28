import { NextResponse } from "next/server";
import { z } from "zod";
import {
  criarTokenSessao,
  EMAIL_SESSION_COOKIE,
  EMAIL_SESSION_MAX_AGE,
  senhaPainelValida,
} from "@/lib/email-panel-session";

export const runtime = "nodejs";

const schema = z.object({ senha: z.string().min(1).max(200) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !senhaPainelValida(parsed.data.senha)) {
    return NextResponse.json({ error: "Senha inválida." }, { status: 401 });
  }

  const response = NextResponse.json({ sucesso: true });
  response.cookies.set(EMAIL_SESSION_COOKIE, criarTokenSessao(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: EMAIL_SESSION_MAX_AGE,
  });
  return response;
}
