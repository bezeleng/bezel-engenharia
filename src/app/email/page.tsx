import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EMAIL_SESSION_COOKIE, validarTokenSessao } from "@/lib/email-panel-session";
import EmailCRMClient from "./EmailCRMClient";

export const dynamic = "force-dynamic";

export default async function EmailProspeccaoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(EMAIL_SESSION_COOKIE)?.value;

  if (!validarTokenSessao(token)) redirect("/email/login");

  return <EmailCRMClient />;
}
