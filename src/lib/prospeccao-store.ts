import { client } from "@/sanity/lib/client";
import { normalizarSegmento } from "@/lib/prospeccao-segmentos";

export type StatusContato = "NOVO" | "CONTATADO" | "RESPONDEU" | "VISITA" | "PROPOSTA" | "NEGOCIACAO" | "CLIENTE" | "ARQUIVADO";

export type ContatoProspeccao = {
  _id: string;
  nome: string;
  email?: string;
  cidade?: string;
  segmento?: string;
  telefone?: string;
  whatsapp?: string;
  site?: string;
  instagram?: string;
  origem?: string;
  pesquisaHunter?: string;
  fonteUrl?: string;
  dominio?: string;
  encontradoEm?: string;
  status: StatusContato;
  optOut: boolean;
  ultimoContatoEm?: string;
  proximoFollowUpEm?: string;
  observacoes?: string;
};

function store() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN não configurado.");
  return client.withConfig({ token, useCdn: false });
}

export function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function listarContatos(): Promise<ContatoProspeccao[]> {
  const contatos = await store().fetch<ContatoProspeccao[]>(
    `*[_type == "prospeccaoContato"] | order(coalesce(ultimoContatoEm, _createdAt) desc) {
      _id, nome, email, cidade, segmento, telefone, whatsapp, site, instagram, origem, pesquisaHunter, fonteUrl, dominio, encontradoEm, status, optOut, ultimoContatoEm, proximoFollowUpEm, observacoes
    }`
  );
  return contatos.map((contato) => ({
    ...contato,
    segmento: normalizarSegmento(contato.segmento),
  }));
}

export async function buscarContatoPorEmail(email: string): Promise<ContatoProspeccao | null> {
  return store().fetch(
    `*[_type == "prospeccaoContato" && email == $email][0]{
      _id, nome, email, cidade, segmento, telefone, whatsapp, site, instagram, origem, pesquisaHunter, fonteUrl, dominio, encontradoEm, status, optOut, ultimoContatoEm, proximoFollowUpEm, observacoes
    }`,
    { email: normalizarEmail(email) }
  );
}

export async function salvarContato(input: {
  nome?: string;
  email: string;
  cidade?: string;
  segmento?: string;
  status?: StatusContato;
  proximoFollowUpEm?: string | null;
  observacoes?: string;
}) {
  const c = store();
  const email = normalizarEmail(input.email);
  const existente = await buscarContatoPorEmail(email);

  if (existente) {
    const patch: Record<string, unknown> = {
      nome: input.nome?.trim() || existente.nome || "",
      cidade: input.cidade?.trim() || existente.cidade || "",
      segmento: input.segmento ? normalizarSegmento(input.segmento) : normalizarSegmento(existente.segmento),
      status: input.status || existente.status || "NOVO",
      observacoes: input.observacoes ?? existente.observacoes ?? "",
    };
    if (input.proximoFollowUpEm !== undefined) patch.proximoFollowUpEm = input.proximoFollowUpEm || null;
    return c.patch(existente._id).set(patch).commit();
  }

  return c.create({
    _type: "prospeccaoContato",
    nome: input.nome?.trim() || "",
    email,
    cidade: input.cidade?.trim() || "",
    segmento: normalizarSegmento(input.segmento),
    status: input.status || "NOVO",
    optOut: false,
    proximoFollowUpEm: input.proximoFollowUpEm || null,
    observacoes: input.observacoes || "",
  });
}

export async function atualizarContato(input: {
  id: string;
  status?: StatusContato;
  optOut?: boolean;
  proximoFollowUpEm?: string | null;
  observacoes?: string;
}) {
  const patch: Record<string, unknown> = {};
  if (input.status !== undefined) patch.status = input.status;
  if (input.optOut !== undefined) patch.optOut = input.optOut;
  if (input.proximoFollowUpEm !== undefined) patch.proximoFollowUpEm = input.proximoFollowUpEm || null;
  if (input.observacoes !== undefined) patch.observacoes = input.observacoes;
  return store().patch(input.id).set(patch).commit();
}

export async function buscarContatoPorDominio(dominio: string): Promise<ContatoProspeccao | null> {
  return store().fetch(
    `*[_type == "prospeccaoContato" && dominio == $dominio][0]{
      _id, nome, email, cidade, segmento, telefone, whatsapp, site, instagram, origem, pesquisaHunter, fonteUrl, dominio, encontradoEm, status, optOut, ultimoContatoEm, proximoFollowUpEm, observacoes
    }`,
    { dominio: dominio.trim().toLowerCase() }
  );
}

export async function buscarDominiosExistentes(dominios: string[]): Promise<string[]> {
  const normalizados = [...new Set(
    dominios.map((dominio) => dominio.trim().toLowerCase()).filter(Boolean)
  )];
  if (!normalizados.length) return [];

  return store().fetch<string[]>(
    `array::unique(*[_type == "prospeccaoContato" && dominio in $dominios].dominio)`,
    { dominios: normalizados }
  );
}

export async function salvarContatoHunter(input: {
  dominio: string; nome: string; email?: string; cidade: string; segmento: string;
  telefone?: string; site: string; instagram?: string; origem?: string; fonteUrl?: string; pesquisaHunter: string;
}) {
  const c = store();
  const dominio = input.dominio.trim().toLowerCase();
  const existente = await buscarContatoPorDominio(dominio);
  const dados = {
    nome: input.nome.trim(), ...(input.email ? { email: normalizarEmail(input.email) } : {}),
    cidade: input.cidade.trim(), segmento: normalizarSegmento(input.segmento),
    telefone: input.telefone?.trim() || "", site: input.site,
    instagram: input.instagram || "", origem: input.origem?.trim() || "Hunter",
    pesquisaHunter: input.pesquisaHunter, fonteUrl: input.fonteUrl || "Hunter.io",
    dominio, encontradoEm: new Date().toISOString(),
  };
  if (existente) {
    const patch = Object.fromEntries(Object.entries(dados).filter(([, value]) => value !== ""));
    return { contato: await c.patch(existente._id).set(patch).commit(), novo: false };
  }
  return { contato: await c.create({
    _type: "prospeccaoContato", ...dados, whatsapp: "", status: "NOVO", optOut: false, observacoes: "",
  }), novo: true };
}

export async function excluirContato(id: string) { return store().delete(id); }

function hojeSaoPaulo() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function totalEnviadoHoje() {
  const data = hojeSaoPaulo();
  const inicio = new Date(`${data}T03:00:00.000Z`).toISOString();
  const fim = new Date(new Date(inicio).getTime() + 24 * 60 * 60 * 1000).toISOString();
  return store().fetch<number>(
    `count(*[_type == "prospeccaoEnvio" && status == "ENVIADO" && teste != true && enviadoEm >= $inicio && enviadoEm < $fim])`,
    { inicio, fim }
  );
}

export async function registrarEnvio(input: {
  campanhaId?: string;
  nome: string;
  email: string;
  assunto: string;
  status: "ENVIADO" | "FALHA" | "BLOQUEADO";
  erro?: string;
  teste?: boolean;
  smtpMessageId?: string;
  smtpResponse?: string;
}) {
  return store().create({
    _type: "prospeccaoEnvio",
    ...input,
    email: normalizarEmail(input.email),
    enviadoEm: new Date().toISOString(),
  });
}

export async function registrarCampanha(input: {
  assunto: string;
  mensagem: string;
  totalDestinatarios: number;
}) {
  return store().create({
    _type: "prospeccaoCampanha",
    ...input,
    criadoEm: new Date().toISOString(),
  });
}

export async function finalizarCampanha(id: string, enviados: number, falhas: number, bloqueados: number) {
  return store().patch(id).set({ enviados, falhas, bloqueados, finalizadoEm: new Date().toISOString() }).commit();
}

export async function registrarContatoEnviado(id: string) {
  return store().patch(id).set({ status: "CONTATADO", ultimoContatoEm: new Date().toISOString() }).commit();
}

export async function listarHistorico(limite = 100) {
  return store().fetch(
    `*[_type == "prospeccaoEnvio"] | order(enviadoEm desc)[0...$limite]{
      _id, nome, email, assunto, status, erro, teste, enviadoEm, smtpMessageId, smtpResponse
    }`,
    { limite }
  );
}

export async function obterDashboard() {
  const c = store();
  const [contatos, historico, enviadosHoje] = await Promise.all([
    listarContatos(),
    listarHistorico(50),
    totalEnviadoHoje(),
  ]);

  const porStatus = contatos.reduce<Record<string, number>>((acc, contato) => {
    acc[contato.status || "NOVO"] = (acc[contato.status || "NOVO"] || 0) + 1;
    return acc;
  }, {});

  const agora = new Date().toISOString();
  const followUpsPendentes = contatos.filter(
    (x) => x.proximoFollowUpEm && x.proximoFollowUpEm <= agora && !x.optOut && x.status !== "CLIENTE" && x.status !== "ARQUIVADO"
  ).length;

  return {
    contatos,
    historico,
    metricas: {
      totalContatos: contatos.length,
      enviadosHoje,
      limiteDiario: 50,
      restantesHoje: Math.max(0, 50 - enviadosHoje),
      optOut: contatos.filter((x) => x.optOut).length,
      followUpsPendentes,
      porStatus,
    },
  };
}
