import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { EMAIL_SESSION_COOKIE, validarTokenSessao } from "@/lib/email-panel-session";
import { obterDashboard } from "@/lib/prospeccao-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  if (!validarTokenSessao(cookieStore.get(EMAIL_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  try {
    return NextResponse.json(await obterDashboard(), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Falha no dashboard de prospecção:", error);
    return NextResponse.json(
      { error: "Base de prospecção indisponível. Verifique SANITY_API_WRITE_TOKEN." },
      { status: 503 }
    );
  }
}
