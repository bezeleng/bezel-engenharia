import { createHmac, timingSafeEqual } from "crypto";

export const EMAIL_SESSION_COOKIE = "bezel_email_session";
const SESSION_SECONDS = 60 * 60 * 8;

function secret() {
  const value = process.env.EMAIL_PANEL_PASSWORD;
  if (!value) throw new Error("EMAIL_PANEL_PASSWORD não configurado.");
  return value;
}

function assinatura(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function criarTokenSessao() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })
  ).toString("base64url");
  return `${payload}.${assinatura(payload)}`;
}

export function validarTokenSessao(token?: string | null) {
  if (!token) return false;
  const [payload, assinaturaRecebida] = token.split(".");
  if (!payload || !assinaturaRecebida) return false;

  const esperada = Buffer.from(assinatura(payload));
  const recebida = Buffer.from(assinaturaRecebida);
  if (esperada.length !== recebida.length || !timingSafeEqual(esperada, recebida)) return false;

  try {
    const dados = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof dados.exp === "number" && dados.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function senhaPainelConfigurada() {
  return Boolean(process.env.EMAIL_PANEL_PASSWORD?.trim());
}

export function senhaPainelValida(recebida: string) {
  const esperada = process.env.EMAIL_PANEL_PASSWORD?.trim();
  if (!esperada) return false;

  const a = Buffer.from(recebida.trim());
  const b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const EMAIL_SESSION_MAX_AGE = SESSION_SECONDS;
