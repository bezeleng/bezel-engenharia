import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { EMAIL_SESSION_COOKIE, validarTokenSessao } from "@/lib/email-panel-session";
import { buscarDominiosExistentes, salvarContatoHunter } from "@/lib/prospeccao-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const schema = z.object({
  segmento: z.string().trim().min(2).max(120),
  localidade: z.string().trim().min(2).max(160),
  quantidade: z.number().int().min(1).max(20).default(10),
  buscarEmail: z.boolean().default(true),
  buscarTelefone: z.boolean().default(true),
  dominiosAnalisados: z.array(z.string().trim().min(1).max(253)).max(500).default([]),
});

type EmpresaDescoberta = {
  domain?: string;
  organization?: string;
  emails_count?: { personal?: number; generic?: number; total?: number };
  telefoneFonte?: string;
  siteFonte?: string;
  emailFonte?: string;
  localidadeConfirmadaFonte?: boolean;
  origem?: "Foursquare" | "Hunter";
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

type FoursquarePlace = {
  fsq_place_id?: string;
  name?: string;
  website?: string;
  tel?: string;
  email?: string;
  location?: {
    locality?: string;
    region?: string;
    country?: string;
    formatted_address?: string;
  };
};

type FoursquareSearchPayload = {
  results?: FoursquarePlace[];
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
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
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
      if (!["http:", "https:"].includes(url.protocol) || !mesmoHost) continue;
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
    return { aprovado: false, evidencias: [] as string[], motivo: "dominio_invalido" as const };
  }

  const tentativasBase = [
    `https://${domain}/`,
    `https://www.${domain}/`,
    `http://${domain}/`,
    `http://www.${domain}/`,
  ];
  let base: URL | undefined;
  let home: string | undefined;
  for (const tentativa of tentativasBase) {
    const html = await baixarPaginaPublica(tentativa);
    if (!html) continue;
    base = new URL(tentativa);
    home = html;
    break;
  }
  if (!home || !base) return { aprovado: false, evidencias: [] as string[], motivo: "site_indisponivel" as const };

  const links = linksInternosRelevantes(home, base);
  const internas = await Promise.all(links.map((link) => baixarPaginaPublica(link)));
  const paginas = [home, ...internas.filter((html): html is string => Boolean(html))];

  const texto = htmlParaTexto(paginas.join(" "));
  const frasesFortes = [
    "administracao de condominios", "administracao de condominio", "administracao condominial",
    "administradora de condominios", "administradora condominial", "gestao de condominios",
    "gestao de condominio", "gestao condominial", "gerenciamento de condominios",
    "gerenciamento condominial", "assessoria condominial", "assessoria de condominios",
    "solucoes condominiais", "gestor condominial", "administramos condominios",
    "administrar seu condominio", "sindico profissional", "sindicancia profissional",
    "condominium management",
  ];
  const evidenciasFortes = frasesFortes.filter((x) => texto.includes(x));

  const sinaisOperacionais = [
    "prestacao de contas", "assembleia", "rateio", "boleto", "taxa condominial",
    "gestao financeira", "gestao administrativa", "apoio ao sindico", "corpo diretivo",
    "condominio residencial", "condominio comercial",
  ].filter((x) => texto.includes(x));

  const aprovado = evidenciasFortes.length > 0 || (texto.includes("condomin") && sinaisOperacionais.length >= 2);
  return {
    aprovado,
    evidencias: [...new Set([...evidenciasFortes, ...sinaisOperacionais])].slice(0, 6),
    motivo: aprovado ? "atividade_comprovada" as const : "sem_evidencia_condominial" as const,
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

function dominioDoSite(site?: string) {
  if (!site) return undefined;
  try {
    const url = new URL(site);
    if (!["http:", "https:"].includes(url.protocol)) return undefined;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (!host || host === "localhost" || host.includes("..") || !/^[a-z0-9.-]+$/i.test(host)) return undefined;
    return host;
  } catch {
    return undefined;
  }
}

const DOMINIOS_EMAIL_PUBLICO = new Set([
  "gmail.com", "googlemail.com", "hotmail.com", "hotmail.com.br", "outlook.com",
  "live.com", "yahoo.com", "yahoo.com.br", "icloud.com", "uol.com.br",
  "bol.com.br", "terra.com.br", "proton.me", "protonmail.com",
]);

function dominioDoEmailCorporativo(email?: string) {
  if (!email) return undefined;
  const valor = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(valor)) return undefined;
  const dominio = valor.split("@")[1]?.replace(/^www\./, "");
  if (!dominio || DOMINIOS_EMAIL_PUBLICO.has(dominio)) return undefined;
  if (!/^[a-z0-9.-]+$/i.test(dominio) || dominio.includes("..")) return undefined;
  return dominio;
}

function tokensMarca(nome: string) {
  const genericos = new Set([
    "administradora", "administracao", "condominio", "condominios", "condominial",
    "gestao", "sindico", "sindicancia", "profissional", "servico", "servicos",
    "empresa", "empresas", "grupo", "brasil", "ltda", "eireli", "limitada",
    "assessoria", "consultoria", "escola", "colegio", "educacao", "ensino",
    "arquitetura", "arquiteto", "arquitetos", "engenharia", "engenheiro", "engenheiros",
    "clinica", "clinicas", "centro", "saude", "de", "da", "do", "das", "dos", "em", "e",
  ]);
  return normalizar(nome)
    .split(/[^a-z0-9]+/)
    .filter((x) => x.length >= 2 && !genericos.has(x));
}

function candidatoDominioCompativel(
  nome: string,
  candidato: { domain?: string; company_name?: string }
) {
  const dominio = candidato.domain?.trim().toLowerCase();
  if (!dominio || !/^[a-z0-9.-]+$/i.test(dominio) || dominio.includes("..")) return false;

  const alvo = normalizar(`${candidato.company_name || ""} ${dominio.replace(/[.-]/g, " ")}`);
  const nomeNormalizado = normalizar(nome);
  const empresaNormalizada = normalizar(candidato.company_name || "");
  if (empresaNormalizada && (empresaNormalizada.includes(nomeNormalizado) || nomeNormalizado.includes(empresaNormalizada))) {
    return true;
  }

  const marca = tokensMarca(nome);
  return marca.length > 0 && marca.some((token) => alvo.includes(token));
}

async function resolverDominioEmpresa(nome: string, key: string): Promise<EmpresaDescoberta | undefined> {
  const url = new URL("https://api.hunter.io/v2/domain-finder");
  url.searchParams.set("company", nome);
  url.searchParams.set("limit", "3");
  url.searchParams.set("perfect_match", "false");
  const r = await hunterFetch(url.toString(), key);
  if (!r.ok) return undefined;
  const json = await r.json() as { data?: Array<{ domain?: string; company_name?: string }> };
  const item = (json.data || []).find((candidato) => candidatoDominioCompativel(nome, candidato));
  if (!item?.domain) return undefined;
  return {
    domain: item.domain.trim().toLowerCase(),
    organization: nome,
  };
}

async function buscarFoursquarePlaces(segmento: string, localidade: string, apiKey: string) {
  const termos = termosDoSegmento(segmento);
  const consultas: Array<{ query: string; categoria?: string }> = ehBuscaCondominial(segmento)
    ? [
        { query: "administração de condomínios", categoria: "63be6904847c3692a84b9b86" },
        { query: "administradora de condomínios" },
        { query: "gestão condominial" },
        { query: "síndico profissional" },
      ]
    : [...new Set([segmento, ...termos.palavras])].slice(0, 4).map((query) => ({ query }));

  const porIdOuNome = new Map<string, FoursquarePlace>();
  const erros: string[] = [];

  for (const consulta of consultas) {
    const url = new URL("https://places-api.foursquare.com/places/search");
    url.searchParams.set("query", consulta.query);
    if (consulta.categoria) url.searchParams.set("fsq_category_ids", consulta.categoria);
    url.searchParams.set("near", localidade);
    url.searchParams.set("limit", "50");
    url.searchParams.set("sort", "RELEVANCE");
    url.searchParams.set("tel_format", "E164");
    url.searchParams.set("fields", "fsq_place_id,name,website,tel,email,location");

    const r = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Places-Api-Version": "2025-06-17",
      },
    });

    if (!r.ok) {
      const detalhe = await r.text();
      console.error("Foursquare Places Search:", r.status, detalhe.slice(0, 500));
      erros.push(`Place Search HTTP ${r.status}: ${detalhe.slice(0, 180)}`);
      continue;
    }

    const payload = await r.json() as FoursquareSearchPayload;
    for (const place of payload.results || []) {
      const nome = place.name?.trim();
      if (!nome) continue;
      const pais = normalizar(place.location?.country || "");
      const cidade = normalizar(place.location?.locality || "");
      if (pais && !["br", "brazil", "brasil"].includes(pais)) continue;
      if (cidade && cidade !== normalizar(cidadeDaLocalidade(localidade))) continue;
      const chave = place.fsq_place_id || `${normalizar(nome)}|${cidade}`;
      if (!porIdOuNome.has(chave)) porIdOuNome.set(chave, place);
    }
  }

  return {
    places: [...porIdOuNome.values()],
    consultas: consultas.length,
    erros: [...new Set(erros)].slice(0, 3),
  };
}

async function descobrirEmpresasFoursquare(
  segmento: string,
  localidade: string,
  hunterKey: string,
  foursquareKey: string | undefined,
  quantidade: number
) {
  if (!foursquareKey) {
    return {
      empresas: [] as EmpresaDescoberta[],
      encontrados: 0,
      comSite: 0,
      comEmailCorporativo: 0,
      resolvidosHunter: 0,
      consultas: 0,
      erros: [] as string[],
    };
  }

  const busca = await buscarFoursquarePlaces(segmento, localidade, foursquareKey);
  const limite = Math.min(busca.places.length, Math.max(quantidade * 3, 30), 60);
  const alvos = busca.places.slice(0, limite);
  const empresas: EmpresaDescoberta[] = [];
  const semDominio: FoursquarePlace[] = [];
  let comSite = 0;
  let comEmailCorporativo = 0;
  let resolvidosHunter = 0;

  for (const place of alvos) {
    const nome = place.name?.trim();
    if (!nome) continue;

    const dominioSite = dominioDoSite(place.website);
    const dominioEmail = dominioDoEmailCorporativo(place.email);
    const dominio = dominioSite || dominioEmail;

    if (!dominio) {
      semDominio.push(place);
      continue;
    }

    if (dominioSite) comSite++;
    else if (dominioEmail) comEmailCorporativo++;

    const emailFonte = dominioEmail === dominio
      ? place.email?.trim().toLowerCase()
      : undefined;

    empresas.push({
      domain: dominio,
      organization: nome,
      telefoneFonte: place.tel?.trim(),
      siteFonte: place.website || `https://${dominio}`,
      emailFonte,
      localidadeConfirmadaFonte: true,
      origem: "Foursquare",
    });
  }

  // Sem site/e-mail corporativo, o Domain Finder retorna até 3 sugestões.
  // perfect_match=false amplia a cobertura; ainda aceitamos somente sugestões
  // cujo nome/domínio mantenha um token de marca da empresa do Foursquare.
  for (let i = 0; i < semDominio.length; i += 8) {
    const lote = await Promise.all(
      semDominio.slice(i, i + 8).map(async (place) => {
        const nome = place.name?.trim();
        if (!nome) return undefined;
        const resolvida = await resolverDominioEmpresa(nome, hunterKey);
        if (!resolvida) return undefined;
        return {
          ...resolvida,
          organization: nome,
          telefoneFonte: place.tel?.trim(),
          emailFonte: undefined,
          localidadeConfirmadaFonte: false,
          origem: "Foursquare",
        } satisfies EmpresaDescoberta;
      })
    );
    for (const resolvida of lote) {
      if (resolvida?.domain) {
        resolvidosHunter++;
        empresas.push(resolvida);
      }
    }
  }

  return {
    empresas,
    encontrados: busca.places.length,
    comSite,
    comEmailCorporativo,
    resolvidosHunter,
    consultas: busca.consultas,
    erros: busca.erros,
  };
}

function telefoneCompativelBrasil(telefone?: string) {
  if (!telefone) return undefined;
  const valor = telefone.trim();
  const digitos = valor.replace(/\D/g, "");
  if (!digitos) return undefined;
  if (valor.startsWith("+") && !valor.startsWith("+55")) return undefined;
  if (digitos.startsWith("55")) return digitos.length >= 12 && digitos.length <= 13 ? valor : undefined;
  return digitos.length >= 10 && digitos.length <= 11 ? valor : undefined;
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
  const tamanhoLote = 8;

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
  const foursquareKey = process.env.FOURSQUARE_API_KEY?.trim();

  const { segmento, localidade, quantidade, buscarEmail, buscarTelefone, dominiosAnalisados } = parsed.data;
  const pesquisaHunter = `${segmento} — ${localidade}`;

  try {
    const [descoberta, foursquare] = await Promise.all([
      descobrirEmpresas(segmento, localidade, key),
      descobrirEmpresasFoursquare(segmento, localidade, key, foursquareKey, quantidade),
    ]);

    // O Foursquare é a fonte local principal. Se o Discover do Hunter falhar,
    // ainda seguimos com as empresas locais e usamos o Hunter apenas para
    // resolver domínio/enriquecer/e-mail.
    if (!descoberta.ok && !foursquare.empresas.length) {
      return NextResponse.json(
        {
          error: foursquare.erros.length
            ? `A busca local no Foursquare falhou: ${foursquare.erros[0]}`
            : descoberta.status === 429
              ? "Limite da conta Hunter.io atingido e o Foursquare não retornou empresas."
              : "Nenhuma das fontes de descoberta conseguiu retornar empresas.",
        },
        { status: 502 }
      );
    }

    const empresasFoursquare = foursquare.empresas;
    const empresas = juntarEmpresas([
      { ok: true, payload: { data: empresasFoursquare } },
      { ok: true, payload: { data: descoberta.empresas } },
    ]);

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
        foursquareConfigurado: Boolean(foursquareKey),
        encontradosFoursquare: empresasFoursquare.length,
        fichasFoursquareEncontradas: foursquare.encontrados,
        fichasFoursquareComSite: foursquare.comSite,
        fichasFoursquareComEmailCorporativo: foursquare.comEmailCorporativo,
        dominiosFoursquareViaHunter: foursquare.resolvidosHunter,
        consultasFoursquare: foursquare.consultas,
        errosFoursquare: foursquare.erros,
        nenhumResultado: true,
        mensagem: `Nenhuma empresa encontrada para “${segmento}” em ${cidadeDaLocalidade(localidade)} após ${descoberta.tentativas} estratégias de busca. Tente um segmento relacionado ou uma cidade próxima.`,
      });
    }

    const dominiosExistentes = new Set(
      await buscarDominiosExistentes(
        empresas.map((empresa) => empresa.domain?.trim().toLowerCase()).filter((dominio): dominio is string => Boolean(dominio))
      )
    );
    const resultados: Array<Record<string, unknown>> = [];
    let cadastrados = 0;
    let jaExistentes = 0;
    let semEmail = 0;
    let descartados = 0;
    let descartadosSiteIndisponivel = 0;
    let descartadosSemEvidenciaCondominial = 0;
    let descartadosAderencia = 0;
    let descartadosLocalidade = 0;
    let analisados = 0;

    // O pool pode variar entre chamadas do Hunter/Foursquare. Por isso a
    // continuação não depende mais de posição numérica: o cliente devolve os
    // domínios já analisados e esta rodada trabalha apenas com os restantes.
    // Também priorizamos domínios ainda não cadastrados no CRM.
    const jaAnalisados = new Set(dominiosAnalisados.map((dominio) => dominio.trim().toLowerCase()));
    const empresasPendentes = empresas
      .filter((empresa) => {
        const dominio = empresa.domain?.trim().toLowerCase();
        return Boolean(dominio) && !jaAnalisados.has(dominio!);
      })
      .sort((a, b) => {
        const aExiste = dominiosExistentes.has(a.domain?.trim().toLowerCase() || "");
        const bExiste = dominiosExistentes.has(b.domain?.trim().toLowerCase() || "");
        return Number(aExiste) - Number(bExiste);
      });
    const limiteBase = Math.max(quantidade * 5, 40);
    const limiteAnalise = Math.min(empresasPendentes.length, limiteBase, 50);
    const empresasDoLote = empresasPendentes.slice(0, limiteAnalise);
    const dominiosAnalisadosRodada: string[] = [];
    const buscaCondominial = ehBuscaCondominial(segmento);
    const validacoesSite = buscaCondominial
      ? await validarSitesCondominiais(empresasDoLote, limiteAnalise)
      : undefined;

    for (const empresa of empresasDoLote) {
      if (resultados.length >= quantidade) break;
      const dominio = empresa.domain!.trim().toLowerCase();
      dominiosAnalisadosRodada.push(dominio);
      analisados++;

      const validacaoSite = buscaCondominial ? validacoesSite?.get(dominio) : undefined;

      // Em administração condominial, descartamos antes do Enrichment/Domain
      // Search quando o próprio site não comprova a atividade. Isso amplia a
      // descoberta sem desperdiçar créditos do Hunter em falsos positivos.
      if (buscaCondominial && !validacaoSite?.aprovado && validacaoSite?.motivo !== "site_indisponivel") {
        descartados++;
        descartadosSemEvidenciaCondominial++;
        continue;
      }

      const enriquecida = await enriquecerEmpresa(dominio, key);
      const aderencia = avaliarAderencia(segmento, empresa, enriquecida);
      const localOk = empresa.localidadeConfirmadaFonte || cidadeCompativel(localidade, enriquecida);
      const atividadeOk = buscaCondominial
        ? Boolean(validacaoSite?.aprovado) || (validacaoSite?.motivo === "site_indisponivel" && aderencia.aprovado)
        : aderencia.aprovado;

      if (!atividadeOk || !localOk) {
        descartados++;
        if (!localOk) descartadosLocalidade++;
        else if (buscaCondominial && validacaoSite?.motivo === "site_indisponivel") descartadosSiteIndisponivel++;
        else descartadosAderencia++;
        continue;
      }

      let email = buscarEmail ? empresa.emailFonte : undefined;
      if (!email && buscarEmail) {
        email = await buscarEmailDominio(dominio, key);
      }
      if (!email && buscarEmail) {
        email = enriquecida?.site?.emailAddresses?.find(Boolean)?.trim().toLowerCase();
      }

      const nome = empresa.organization?.trim() || enriquecida?.name?.trim() || dominio;
      const telefone = buscarTelefone
        ? telefoneCompativelBrasil(
            empresa.telefoneFonte || enriquecida?.site?.phoneNumbers?.find(Boolean) || enriquecida?.phone || undefined
          )
        : undefined;
      const handleInstagram = enriquecida?.instagram?.handle?.replace(/^@/, "");
      const instagram = handleInstagram ? `https://www.instagram.com/${handleInstagram}/` : undefined;
      const site = empresa.siteFonte || `https://${dominio}`;

      const salvo = await salvarContatoHunter({
        dominio,
        nome,
        email,
        cidade: localidade,
        segmento,
        telefone,
        site,
        instagram,
        origem: empresa.origem === "Foursquare" ? "Foursquare + Hunter" : "Hunter",
        fonteUrl: empresa.origem === "Foursquare" ? "Foursquare Places + Hunter.io" : "Hunter.io API",
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
    const candidatosRestantes = Math.max(0, empresasPendentes.length - analisados);
    const continuacaoDisponivel = candidatosRestantes > 0;
    return NextResponse.json({
      cadastrados,
      jaExistentes,
      semEmail,
      descartados,
      descartadosSiteIndisponivel,
      descartadosSemEvidenciaCondominial,
      descartadosAderencia,
      descartadosLocalidade,
      analisados,
      qualificados: resultados.length,
      candidatosUnicos: empresas.length,
      candidatosJaCadastradosNoPool: dominiosExistentes.size,
      candidatosNovosNoPool: Math.max(0, empresas.length - dominiosExistentes.size),
      dominiosAnalisadosRodada,
      totalDominiosAnalisados: jaAnalisados.size + dominiosAnalisadosRodada.length,
      candidatosRestantes,
      continuacaoDisponivel,
      limiteAnalise,
      limiteAnaliseAtingido: analisados >= limiteAnalise && resultados.length < quantidade && continuacaoDisponivel,
      resultados,
      tentativas: descoberta.tentativas,
      estrategia: descoberta.estrategia,
      foursquareConfigurado: Boolean(foursquareKey),
      encontradosFoursquare: empresasFoursquare.length,
      fichasFoursquareEncontradas: foursquare.encontrados,
      fichasFoursquareComSite: foursquare.comSite,
      fichasFoursquareComEmailCorporativo: foursquare.comEmailCorporativo,
      dominiosFoursquareViaHunter: foursquare.resolvidosHunter,
      consultasFoursquare: foursquare.consultas,
      errosFoursquare: foursquare.erros,
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
