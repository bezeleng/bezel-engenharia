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
  const buscaCondominial = ehBuscaCondominial(segmento);
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

function ehBuscaCondominial(segmento: string) {
  const alvo = normalizar(segmento);
  return ["condominio", "condominial", "sindico"].some((x) => alvo.includes(x));
}

function htmlParaTexto(html: string) {
  return normalizar(
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&#160;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, " ")
  );
}

function linksInternosRelevantes(html: string, base: URL) {
  const encontrados: string[] = [];
  const re = /href=["']([^"'#]+)["']/gi;
  const palavras = ["condomin", "sindico", "servico", "administr", "gestao", "quem-somos", "sobre"];
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) && encontrados.length < 3) {
    try {
      const url = new URL(match[1], base);
      const mesmoHost = url.hostname === base.hostname || url.hostname === `www.${base.hostname}` || `www.${url.hostname}` === base.hostname;
      if (url.protocol !== "https:" || !mesmoHost) continue;
      const alvo = normalizar(url.pathname);
      if (palavras.some((p) => alvo.includes(p)) && !encontrados.includes(url.toString())) encontrados.push(url.toString());
    } catch {
      // link inválido: ignora
    }
  }
  return encontrados;
}

async function baixarPaginaPublica(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const r = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BEZEL-CRM/1.0)" },
    });
    if (!r.ok) return undefined;
    const tipo = r.headers.get("content-type") || "";
    if (!tipo.includes("text/html")) return undefined;
    return (await r.text()).slice(0, 700_000);
  } catch {
    return undefined;
  } finally {
    clearTimeout(timeout);
  }
}

async function validarAtividadeCondominialNoSite(domain: string) {
  // Falha fechada: se não houver evidência pública no site, não cadastra como
  // administradora. Isso privilegia precisão em vez de completar a quantidade.
  if (!/^[a-z0-9.-]+$/i.test(domain) || domain.includes("..") || domain === "localhost") {
    return { aprovado: false, evidencias: [] as string[] };
  }

  const base = new URL(`https://${domain}/`);
  const home = await baixarPaginaPublica(base.toString());
  if (!home) return { aprovado: false, evidencias: [] as string[] };

  const paginas = [home];
  const links = linksInternosRelevantes(home, base);
  for (const link of links) {
    const html = await baixarPaginaPublica(link);
    if (html) paginas.push(html);
  }

  const texto = htmlParaTexto(paginas.join(" "));
  const frasesFortes = [
    "administracao de condominios", "administracao de condominio", "administracao condominial",
    "administradora de condominios", "administradora condominial", "gestao de condominios",
    "gestao de condominio", "gestao condominial", "gerenciamento de condominios",
    "gerenciamento condominial", "sindico profissional", "sindicancia profissional",
    "condominium management",
  ];
  const evidenciasFortes = frasesFortes.filter((x) => texto.includes(x));

  const sinaisOperacionais = [
    "prestacao de contas", "assembleia", "rateio", "boleto", "taxa condominial",
    "gestao financeira", "gestao administrativa", "apoio ao sindico", "corpo diretivo",
    "condominio residencial", "condominio comercial",
  ].filter((x) => texto.includes(x));

  const aprovado = evidenciasFortes.length > 0 || (texto.includes("condomin") && sinaisOperacionais.length >= 3);
  return {
    aprovado,
    evidencias: [...new Set([...evidenciasFortes, ...sinaisOperacionais])].slice(0, 6),
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

function juntarEmpresas(resultados: Array<{ ok: boolean; payload?: DiscoverPayload }>) {
  const porDominio = new Map<string, EmpresaDescoberta>();
  for (const resultado of resultados) {
    if (!resultado.ok) continue;
    for (const empresa of resultado.payload?.data || []) {
      const dominio = empresa.domain?.trim().toLowerCase();
      if (!dominio || porDominio.has(dominio)) continue;
      porDominio.set(dominio, empresa);
    }
  }
  return [...porDominio.values()];
}

async function descobrirEmpresas(segmento: string, localidade: string, key: string) {
  const cidade = cidadeDaLocalidade(localidade);
  const termos = termosDoSegmento(segmento);
  const condominial = ehBuscaCondominial(segmento);

  // Em vez de parar na primeira resposta do Discover, executamos consultas
  // complementares e unimos os domínios. O filtro pelo site continua sendo a
  // barreira final de qualidade, então ampliar a descoberta não reduz precisão.
  const consultas: Array<Record<string, unknown>> = [
    {
      headquarters_location: { include: [{ city: cidade, country: "BR" }] },
      keywords: { match: "any", include: termos.palavras },
    },
    { query: `${termos.consulta} com sede em ${cidade}, Brasil` },
    { query: `${segmento} em ${cidade}, SP, Brasil` },
  ];

  if (condominial) {
    consultas.push(
      { query: `administradora de condomínios em ${cidade}, SP, Brasil` },
      { query: `gestão condominial e síndico profissional em ${cidade}, SP, Brasil` },
      { query: `empresa que administra condomínios em ${cidade}, SP, Brasil` },
    );
  }

  const resultados = await Promise.all(consultas.map((body) => executarDiscover(key, body)));
  const sucessos = resultados.filter((x) => x.ok);
  const empresas = juntarEmpresas(resultados);

  if (!sucessos.length) {
    const status = resultados.find((x) => !x.ok)?.status || 502;
    return { ok: false as const, status, empresas: [] as EmpresaDescoberta[], tentativas: consultas.length, estrategia: "multiconsulta" };
  }

  return {
    ok: true as const,
    status: 200,
    empresas,
    tentativas: consultas.length,
    estrategia: condominial ? "multiconsulta condominial" : "multiconsulta",
  };
}

async function validarSitesCondominiais(empresas: EmpresaDescoberta[], limite: number) {
  const mapa = new Map<string, Awaited<ReturnType<typeof validarAtividadeCondominialNoSite>>>();
  const alvos = empresas.slice(0, limite).filter((x) => x.domain);
  const tamanhoLote = 5;

  for (let i = 0; i < alvos.length; i += tamanhoLote) {
    const lote = alvos.slice(i, i + tamanhoLote);
    const validados = await Promise.all(
      lote.map(async (empresa) => {
        const dominio = empresa.domain!.trim().toLowerCase();
        return [dominio, await validarAtividadeCondominialNoSite(dominio)] as const;
      })
    );
    for (const [dominio, validacao] of validados) mapa.set(dominio, validacao);
  }

  return mapa;
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
    const limiteAnalise = Math.min(empresas.length, Math.max(quantidade * 3, 30), 50);
    const buscaCondominial = ehBuscaCondominial(segmento);
    const validacoesSite = buscaCondominial
      ? await validarSitesCondominiais(empresas, limiteAnalise)
      : undefined;

    for (const empresa of empresas.slice(0, limiteAnalise)) {
      if (resultados.length >= quantidade) break;
      const dominio = empresa.domain!.trim().toLowerCase();
      analisados++;

      const validacaoSite = buscaCondominial ? validacoesSite?.get(dominio) : undefined;

      // Em administração condominial, descartamos antes do Enrichment/Domain
      // Search quando o próprio site não comprova a atividade. Isso amplia a
      // descoberta sem desperdiçar créditos do Hunter em falsos positivos.
      if (buscaCondominial && !validacaoSite?.aprovado) {
        descartados++;
        continue;
      }

      const enriquecida = await enriquecerEmpresa(dominio, key);
      const aderencia = avaliarAderencia(segmento, empresa, enriquecida);
      const localOk = cidadeCompativel(localidade, enriquecida);
      const atividadeOk = buscaCondominial ? Boolean(validacaoSite?.aprovado) : aderencia.aprovado;

      if (!atividadeOk || !localOk) {
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
        evidencias: validacaoSite?.evidencias || aderencia.evidencias,
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
