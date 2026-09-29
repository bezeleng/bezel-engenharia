import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { EMAIL_SESSION_COOKIE, validarTokenSessao } from "@/lib/email-panel-session";
import { salvarContatoHunter } from "@/lib/prospeccao-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const schema = z.object({
  segmento: z.string().trim().min(2).max(120),
  localidade: z.string().trim().min(2).max(160),
  quantidade: z.number().int().min(1).max(20).default(10),
  buscarEmail: z.boolean().default(true),
  buscarTelefone: z.boolean().default(true),
});

type EmpresaDescoberta = {
  domain?: string;
  organization?: string;
  emails_count?: { personal?: number; generic?: number; total?: number };
};

type EmailHunter = {
  value?: string;
  type?: "personal" | "generic";
  confidence?: number;
};

type EmpresaEnriquecida = {
  name?: string;
  domain?: string;
  phone?: string;
  site?: { phoneNumbers?: string[]; emailAddresses?: string[] };
  instagram?: { handle?: string | null };
};

async function hunterFetch(url: string, key: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": key,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
}

async function buscarEmailDominio(domain: string, key: string) {
  const url = new URL("https://api.hunter.io/v2/domain-search");
  url.searchParams.set("domain", domain);
  url.searchParams.set("limit", "10");
  const r = await hunterFetch(url.toString(), key);
  if (r.status === 451) return undefined;
  if (!r.ok) return undefined;
  const json = await r.json() as { data?: { emails?: EmailHunter[] } };
  const emails = (json.data?.emails || []).filter((x) => x.value);
  emails.sort((a, b) => {
    const prioridadeA = a.type === "generic" ? 1000 : 0;
    const prioridadeB = b.type === "generic" ? 1000 : 0;
    return (prioridadeB + (b.confidence || 0)) - (prioridadeA + (a.confidence || 0));
  });
  return emails[0]?.value?.trim().toLowerCase();
}

async function enriquecerEmpresa(domain: string, key: string) {
  const url = new URL("https://api.hunter.io/v2/companies/find");
  url.searchParams.set("domain", domain);
  const r = await hunterFetch(url.toString(), key);
  if (!r.ok) return undefined;
  const json = await r.json() as { data?: EmpresaEnriquecida };
  return json.data;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!validarTokenSessao(cookieStore.get(EMAIL_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Preencha segmento, localidade e quantidade corretamente." }, { status: 400 });
  }

  const key = process.env.HUNTER_API_KEY?.trim();
  if (!key) {
    return NextResponse.json({ error: "HUNTER_API_KEY ainda não foi configurada na Vercel." }, { status: 503 });
  }

  const { segmento, localidade, quantidade, buscarEmail, buscarTelefone } = parsed.data;
  const pesquisaHunter = `${segmento} — ${localidade}`;

  try {
    const descoberta = await hunterFetch("https://api.hunter.io/v2/discover", key, {
      method: "POST",
      body: JSON.stringify({ query: `${segmento} em ${localidade}, Brasil` }),
    });

    if (!descoberta.ok) {
      const detalhe = await descoberta.text();
      console.error("Hunter Discover:", descoberta.status, detalhe.slice(0, 500));
      return NextResponse.json(
        { error: descoberta.status === 429 ? "Limite da conta Hunter.io atingido." : "A busca no Hunter.io falhou. Verifique a chave e o acesso ao Discover." },
        { status: 502 }
      );
    }

    const payload = await descoberta.json() as { data?: EmpresaDescoberta[] };
    const empresas = (payload.data || []).filter((x) => x.domain).slice(0, quantidade);
    const resultados: Array<Record<string, unknown>> = [];
    let cadastrados = 0;
    let jaExistentes = 0;
    let semEmail = 0;

    for (const empresa of empresas) {
      const dominio = empresa.domain!.trim().toLowerCase();
      let email = buscarEmail ? await buscarEmailDominio(dominio, key) : undefined;
      const enriquecida = buscarTelefone || (buscarEmail && !email) ? await enriquecerEmpresa(dominio, key) : undefined;

      if (!email && buscarEmail) {
        email = enriquecida?.site?.emailAddresses?.find(Boolean)?.trim().toLowerCase();
      }

      const nome = enriquecida?.name?.trim() || empresa.organization?.trim() || dominio;
      const telefone = buscarTelefone
        ? (enriquecida?.site?.phoneNumbers?.find(Boolean) || enriquecida?.phone || undefined)
        : undefined;
      const handleInstagram = enriquecida?.instagram?.handle?.replace(/^@/, "");
      const instagram = handleInstagram ? `https://www.instagram.com/${handleInstagram}/` : undefined;
      const site = `https://${dominio}`;

      const salvo = await salvarContatoHunter({
        dominio,
        nome,
        email,
        cidade: localidade,
        segmento,
        telefone,
        site,
        instagram,
        fonteUrl: "Hunter.io API",
        pesquisaHunter,
      });

      if (salvo.novo) cadastrados++; else jaExistentes++;
      if (!email) semEmail++;

      resultados.push({
        dominio,
        cadastrado: true,
        novo: salvo.novo,
        nome,
        email,
        telefone,
        site,
        instagram,
        motivo: !email ? "Empresa cadastrada, mas nenhum e-mail profissional foi encontrado." : undefined,
      });
    }

    return NextResponse.json({ cadastrados, jaExistentes, semEmail, resultados });
  } catch (error) {
    console.error("Hunter CRM:", error);
    return NextResponse.json({ error: "Não foi possível concluir a busca do Hunter." }, { status: 500 });
  }
}
