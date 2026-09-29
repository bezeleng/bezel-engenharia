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

type DiscoverPayload = {
  data?: EmpresaDescoberta[];
  meta?: { results?: number; filters?: Record<string, unknown> };
};

const SINONIMOS_SEGMENTO: Array<{ termos: string[]; palavras: string[]; consulta: string }> = [
  {
    termos: ["síndico", "sindico", "síndicos", "sindicos", "condomínio", "condominio", "condomínios", "condominios"],
    palavras: ["administração de condomínios", "administradora de condomínios", "gestão condominial", "condomínios"],
    consulta: "empresas de administração de condomínios e gestão condominial",
  },
  {
    termos: ["arquiteto", "arquitetos", "arquitetura"],
    palavras: ["arquitetura", "escritório de arquitetura", "projetos arquitetônicos"],
    consulta: "escritórios e empresas de arquitetura",
  },
  {
    termos: ["engenheiro", "engenheiros", "engenharia"],
    palavras: ["engenharia", "empresa de engenharia", "projetos de engenharia"],
    consulta: "empresas e escritórios de engenharia",
  },
  {
    termos: ["escola", "escolas", "colégio", "colegio", "colégios", "colegios"],
    palavras: ["escola", "colégio", "educação", "ensino"],
    consulta: "escolas e colégios particulares",
  },
  {
    termos: ["clínica", "clinica", "clínicas", "clinicas"],
    palavras: ["clínica", "consultório", "saúde"],
    consulta: "clínicas e centros de saúde",
  },
];

function normalizar(valor: string) {
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function termosDoSegmento(segmento: string) {
  const alvo = normalizar(segmento);
  const mapeado = SINONIMOS_SEGMENTO.find((grupo) =>
    grupo.termos.some((termo) => alvo.includes(normalizar(termo)))
  );
  return {
    palavras: mapeado?.palavras || [segmento],
    consulta: mapeado?.consulta || `empresas de ${segmento}`,
  };
}

function cidadeDaLocalidade(localidade: string) {
  return localidade.split(",")[0]?.trim() || localidade.trim();
}

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

async function executarDiscover(key: string, body: Record<string, unknown>) {
  const r = await hunterFetch("https://api.hunter.io/v2/discover?locale=pt", key, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!r.ok) {
    const detalhe = await r.text();
    console.error("Hunter Discover:", r.status, detalhe.slice(0, 500));
    return { ok: false as const, status: r.status, payload: undefined };
  }

  const payload = await r.json() as DiscoverPayload;
  return { ok: true as const, status: r.status, payload };
}

async function descobrirEmpresas(segmento: string, localidade: string, key: string) {
  const cidade = cidadeDaLocalidade(localidade);
  const termos = termosDoSegmento(segmento);
  let tentativas = 0;

  const estruturada = await executarDiscover(key, {
    headquarters_location: { include: [{ city: cidade, country: "BR" }] },
    keywords: { match: "any", include: termos.palavras },
  });
  tentativas++;

  if (!estruturada.ok) return { ...estruturada, empresas: [] as EmpresaDescoberta[], tentativas, estrategia: "estruturada" };
  let empresas = (estruturada.payload?.data || []).filter((x) => x.domain);
  if (empresas.length) {
    return { ok: true as const, status: 200, empresas, tentativas, estrategia: "cidade + palavras-chave" };
  }

  const ampliada = await executarDiscover(key, {
    query: `${termos.consulta} com sede em ${cidade}, Brasil`,
  });
  tentativas++;

  if (!ampliada.ok) return { ...ampliada, empresas: [] as EmpresaDescoberta[], tentativas, estrategia: "ampliada" };
  empresas = (ampliada.payload?.data || []).filter((x) => x.domain);
  if (empresas.length) {
    return { ok: true as const, status: 200, empresas, tentativas, estrategia: "busca ampliada" };
  }

  const alternativa = await executarDiscover(key, {
    query: `${segmento}. Empresas localizadas em ${cidade}, Brasil. Inclua negócios relacionados e variações do segmento.`,
  });
  tentativas++;

  if (!alternativa.ok) return { ...alternativa, empresas: [] as EmpresaDescoberta[], tentativas, estrategia: "alternativa" };
  empresas = (alternativa.payload?.data || []).filter((x) => x.domain);

  return { ok: true as const, status: 200, empresas, tentativas, estrategia: empresas.length ? "busca alternativa" : "sem resultados" };
}

async function buscarEmailDominio(domain: string, key: string) {
  const url = new URL("https://api.hunter.io/v2/domain-search");
  url.searchParams.set("domain", domain);
  url.searchParams.set("limit", "10");
  const r = await hunterFetch(url.toString(), key);
  if (r.status === 451 || !r.ok) return undefined;
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
    const descoberta = await descobrirEmpresas(segmento, localidade, key);

    if (!descoberta.ok) {
      return NextResponse.json(
        {
          error: descoberta.status === 429
            ? "Limite da conta Hunter.io atingido."
            : descoberta.status === 403
              ? "Sua conta Hunter.io não possui acesso ao Discover."
              : "A busca no Hunter.io falhou. Verifique a chave e o acesso ao Discover.",
        },
        { status: 502 }
      );
    }

    const empresas = descoberta.empresas.slice(0, quantidade);

    if (!empresas.length) {
      return NextResponse.json({
        cadastrados: 0,
        jaExistentes: 0,
        semEmail: 0,
        resultados: [],
        tentativas: descoberta.tentativas,
        estrategia: descoberta.estrategia,
        nenhumResultado: true,
        mensagem: `Nenhuma empresa encontrada para “${segmento}” em ${cidadeDaLocalidade(localidade)} após ${descoberta.tentativas} estratégias de busca. Tente um segmento relacionado ou uma cidade próxima.`,
      });
    }

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

    return NextResponse.json({
      cadastrados,
      jaExistentes,
      semEmail,
      resultados,
      tentativas: descoberta.tentativas,
      estrategia: descoberta.estrategia,
      nenhumResultado: false,
    });
  } catch (error) {
    console.error("Hunter CRM:", error);
    return NextResponse.json({ error: "Não foi possível concluir a busca do Hunter." }, { status: 500 });
  }
}
