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
  category?: { sector?: string; industryGroup?: string; industry?: string; subIndustry?: string };
  tags?: string[];
  description?: string;
  location?: string;
  geo?: { city?: string; countryCode?: string };
};

type DiscoverPayload = {
  data?: EmpresaDescoberta[];
  meta?: { results?: number; filters?: Record<string, unknown> };
};

const SINONIMOS_SEGMENTO: Array<{ termos: string[]; palavras: string[]; consulta: string; qualificacao: string[] }> = [
  {
    termos: ["síndico", "sindico", "síndicos", "sindicos", "condomínio", "condominio", "condomínios", "condominios"],
    palavras: ["administração de condomínios", "administradora de condomínios", "gestão condominial", "condomínios"],
    consulta: "empresas de administração de condomínios e gestão condominial",
    qualificacao: ["condominio", "condominios", "condominial", "sindico", "sindicos", "gestao condominial", "administracao condominial", "property management"],
  },
  {
    termos: ["arquiteto", "arquitetos", "arquitetura"],
    palavras: ["arquitetura", "escritório de arquitetura", "projetos arquitetônicos"],
    consulta: "escritórios e empresas de arquitetura",
    qualificacao: ["arquitetura", "arquiteto", "arquitetos", "architect", "architectural"],
  },
  {
    termos: ["engenheiro", "engenheiros", "engenharia"],
    palavras: ["engenharia", "empresa de engenharia", "projetos de engenharia"],
    consulta: "empresas e escritórios de engenharia",
    qualificacao: ["engenharia", "engenheiro", "engenheiros", "engineering", "engineer"],
  },
  {
    termos: ["escola", "escolas", "colégio", "colegio", "colégios", "colegios"],
    palavras: ["escola", "colégio", "educação", "ensino"],
    consulta: "escolas e colégios particulares",
    qualificacao: ["escola", "colegio", "ensino", "educacao", "school", "education"],
  },
  {
    termos: ["clínica", "clinica", "clínicas", "clinicas"],
    palavras: ["clínica", "consultório", "saúde"],
    consulta: "clínicas e centros de saúde",
    qualificacao: ["clinica", "consultorio", "saude", "medicina", "odontologia", "medical", "health", "dental"],
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
  const palavrasGenericas = normalizar(segmento)
    .split(/[^a-z0-9]+/)
    .filter((x) => x.length >= 4 && !["para", "empresas", "empresa"].includes(x));
  return {
    palavras: mapeado?.palavras || [segmento],
    consulta: mapeado?.consulta || `empresas de ${segmento}`,
    qualificacao: mapeado?.qualificacao || palavrasGenericas,
  };
}

function avaliarAderencia(segmento: string, empresa: EmpresaDescoberta, enriquecida?: EmpresaEnriquecida) {
  const alvo = normalizar(segmento);
  const termos = termosDoSegmento(segmento).qualificacao.map(normalizar);
  const nomeDominio = normalizar([enriquecida?.name, empresa.organization, empresa.domain].filter(Boolean).join(" "));
  const contexto = normalizar([
    enriquecida?.category?.sector,
    enriquecida?.category?.industryGroup,
    enriquecida?.category?.industry,
    enriquecida?.category?.subIndustry,
    ...(enriquecida?.tags || []),
    enriquecida?.description,
  ].filter(Boolean).join(" "));

  // Administração condominial exige evidência explícita da ATIVIDADE.
  // Menções genéricas a "condomínio" não bastam: imobiliárias, engenharia,
  // segurança, paisagismo e hotéis podem citar condomínios sem administrá-los.
  const buscaCondominial = ["condominio", "condominial", "sindico"].some((x) => alvo.includes(x));
  if (buscaCondominial) {
    const nomeEspecialista = [
      "administradora de condominio", "administracao de condominio", "administracao condominial",
      "gestao condominial", "gestao de condominio", "condominios", "condominial",
      "sindico", "sindicancia", "property management",
    ].filter((termo) => nomeDominio.includes(termo));

    const atividadeExplicita = [
      "administracao de condominios", "administracao de condominio", "administracao condominial",
      "administradora de condominios", "gestao de condominios", "gestao de condominio",
      "gestao condominial", "gerenciamento de condominios", "gerenciamento condominial",
      "servicos condominiais", "sindicancia profissional", "sindico profissional",
      "condominium management", "property management",
    ].filter((termo) => contexto.includes(termo));

    const aprovado = nomeEspecialista.length > 0 || atividadeExplicita.length > 0;
    return {
      aprovado,
      pontuacao: nomeEspecialista.length * 5 + atividadeExplicita.length * 4,
      evidencias: [...new Set([...nomeEspecialista, ...atividadeExplicita])].slice(0, 5),
    };
  }

  // Para os demais segmentos, nome/domínio é evidência forte. Quando a
  // evidência aparece apenas no perfil da empresa, exigimos mais de um sinal
  // para evitar que uma menção incidental classifique o lead no segmento.
  const evidenciasFortes = termos.filter((termo) => nomeDominio.includes(termo));
  const evidenciasContexto = termos.filter((termo) => contexto.includes(termo));
  const pontuacao = evidenciasFortes.length * 3 + evidenciasContexto.length;
  const aprovado = evidenciasFortes.length > 0 || evidenciasContexto.length >= 2;

  return {
    aprovado,
    pontuacao,
    evidencias: [...new Set([...evidenciasFortes, ...evidenciasContexto])].slice(0, 5),
  };
}

function cidadeCompativel(localidade: string, enriquecida?: EmpresaEnriquecida) {
  if (!enriquecida?.geo?.city) return true;
  if (enriquecida.geo.countryCode && enriquecida.geo.countryCode !== "BR") return false;
  return normalizar(enriquecida.geo.city) === normalizar(cidadeDaLocalidade(localidade));
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

    const empresas = descoberta.empresas;

    if (!empresas.length) {
      return NextResponse.json({
        cadastrados: 0,
        jaExistentes: 0,
        semEmail: 0,
        descartados: 0,
        analisados: 0,
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
    let descartados = 0;
    let analisados = 0;

    // O Discover pode devolver empresas relacionadas, especialmente nos fallbacks.
    // Antes de gastar uma busca de e-mail e antes de cadastrar no CRM, validamos
    // a aderência usando nome, domínio, categoria, tags e descrição do Enrichment.
    // Limitamos a análise para controlar tempo e consumo de créditos.
    const limiteAnalise = Math.min(empresas.length, Math.max(quantidade * 2, 25));

    for (const empresa of empresas.slice(0, limiteAnalise)) {
      if (resultados.length >= quantidade) break;
      const dominio = empresa.domain!.trim().toLowerCase();
      analisados++;

      const enriquecida = await enriquecerEmpresa(dominio, key);
      const aderencia = avaliarAderencia(segmento, empresa, enriquecida);
      const localOk = cidadeCompativel(localidade, enriquecida);

      if (!aderencia.aprovado || !localOk) {
        descartados++;
        continue;
      }

      let email = buscarEmail ? await buscarEmailDominio(dominio, key) : undefined;
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
        aderencia: aderencia.pontuacao,
        evidencias: aderencia.evidencias,
        motivo: !email ? "Empresa qualificada, mas nenhum e-mail profissional foi encontrado." : undefined,
      });
    }

    const nenhumResultado = resultados.length === 0;
    return NextResponse.json({
      cadastrados,
      jaExistentes,
      semEmail,
      descartados,
      analisados,
      resultados,
      tentativas: descoberta.tentativas,
      estrategia: descoberta.estrategia,
      nenhumResultado,
      mensagem: nenhumResultado
        ? `Nenhuma empresa qualificada para “${segmento}” em ${cidadeDaLocalidade(localidade)}. ${descartados} resultado(s) foram descartados por baixa aderência ao segmento ou localidade.`
        : undefined,
    });
  } catch (error) {
    console.error("Hunter CRM:", error);
    return NextResponse.json({ error: "Não foi possível concluir a busca do Hunter." }, { status: 500 });
  }
}
