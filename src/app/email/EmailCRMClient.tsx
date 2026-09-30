"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HunterPanel from "./HunterPanel";
import { normalizarSegmento } from "@/lib/prospeccao-segmentos";

type StatusContato = "NOVO" | "CONTATADO" | "RESPONDEU" | "VISITA" | "PROPOSTA" | "NEGOCIACAO" | "CLIENTE" | "ARQUIVADO";
type Contato = {
  _id: string; nome: string; email?: string; cidade?: string; segmento?: string;
  telefone?: string; whatsapp?: string; site?: string; instagram?: string; origem?: string;
  status: StatusContato; optOut: boolean; ultimoContatoEm?: string;
  proximoFollowUpEm?: string; observacoes?: string;
};
type Historico = {
  _id: string; nome?: string; email: string; assunto?: string;
  status: "ENVIADO" | "FALHA" | "BLOQUEADO"; erro?: string; teste?: boolean; enviadoEm: string;
  smtpMessageId?: string; smtpResponse?: string;
};
type Dashboard = {
  contatos: Contato[];
  historico: Historico[];
  metricas: {
    totalContatos: number; enviadosHoje: number; limiteDiario: number; restantesHoje: number;
    optOut: number; followUpsPendentes: number; porStatus: Record<string, number>;
  };
};

const STATUS: Array<{ value: StatusContato; label: string }> = [
  { value: "NOVO", label: "Novo" }, { value: "CONTATADO", label: "Contatado" },
  { value: "RESPONDEU", label: "Respondeu" }, { value: "VISITA", label: "Visita" },
  { value: "PROPOSTA", label: "Proposta" }, { value: "NEGOCIACAO", label: "Negociação" },
  { value: "CLIENTE", label: "Cliente" }, { value: "ARQUIVADO", label: "Arquivado" },
];

const TEMPLATES = {
  geral: {
    label: "Prospecção geral",
    assunto: "Parceria para obras, reformas e manutenção predial",
    mensagem: `Olá, {{nome}}.

Meu nome é Diego e falo em nome da BEZEL Engenharia, Arquitetura e Gestão de Obras.

Atuamos em Jacareí, São José dos Campos e região com construção, reformas, manutenção predial, mão de obra especializada e gerenciamento de obras.

Estamos ampliando nossa rede de parceiros na região e gostaríamos de colocar a BEZEL à disposição para demandas de obras, reformas e manutenção de seus clientes, imóveis ou condomínios atendidos por vocês.

Podemos apoiar desde o levantamento e orçamento inicial até a execução e acompanhamento da obra, organizando equipes, materiais, etapas, custos e cronograma.

Também estamos abertos a parcerias comerciais por indicação, com condições de comissionamento previamente alinhadas quando uma oportunidade indicada se converte em contrato.

Se fizer sentido, fico à disposição para uma conversa ou visita técnica sem compromisso.

Atenciosamente,
BEZEL | Engenharia • Arquitetura • Gestão de Obras
(12) 99183-6206
@grupobezel
bezel.com.br`,
  },
  escolas: {
    label: "Escolas",
    assunto: "Aos cuidados da Administração/Direção — manutenção predial para o recesso escolar",
    mensagem: `Prezados(as), bom dia.

Meu nome é Diego e falo em nome da BEZEL Engenharia, Arquitetura e Gestão de Obras.

Com a proximidade do encerramento do ano letivo, estamos entrando em contato com instituições de ensino da região para disponibilizar nossa equipe para o planejamento e execução de serviços durante o período de recesso escolar.

Esse período permite realizar intervenções com menor impacto na rotina da instituição e preparar os ambientes para o início do próximo ano letivo.

Entre os serviços que podemos atender estão pintura interna e externa, recuperação de fachadas, impermeabilização, manutenção de coberturas, pisos e revestimentos, elétrica, hidráulica, adequação de ambientes e reformas em geral.

A BEZEL também realiza o planejamento e gerenciamento da execução, coordenando equipes, materiais, etapas e cronograma.

Gostaríamos de nos colocar à disposição da {{nome}} para uma visita técnica sem compromisso.

Agradeço pela atenção e fico à disposição.

Atenciosamente,
BEZEL | Engenharia • Arquitetura • Gestão de Obras
(12) 99183-6206
@grupobezel
bezel.com.br`,
  },
  parceiros: {
    label: "Arquitetos e engenheiros",
    assunto: "BEZEL — parceria para execução e gestão de obras",
    mensagem: `Olá, {{nome}}.

Meu nome é Diego e falo em nome da BEZEL Engenharia, Arquitetura e Gestão de Obras.

Estamos ampliando nossa rede de parceiros na região e gostaria de apresentar a BEZEL como apoio para execução, gerenciamento e acompanhamento de obras.

Atendemos construção e reformas, mão de obra especializada e diferentes sistemas construtivos, sempre buscando preservar o projeto, o padrão de acabamento e a comunicação com o profissional responsável.

Caso tenha projetos entrando em fase de orçamento ou execução, ficamos à disposição para conversar e avaliar uma possível parceria.

Atenciosamente,
BEZEL | Engenharia • Arquitetura • Gestão de Obras
(12) 99183-6206
@grupobezel
bezel.com.br`,
  },
  empresas: {
    label: "Empresas / comercial",
    assunto: "BEZEL — manutenção, reformas e gestão de obras",
    mensagem: `Olá, {{nome}}.

Meu nome é Diego e falo em nome da BEZEL Engenharia, Arquitetura e Gestão de Obras.

Atendemos empresas e imóveis comerciais com reformas, manutenção predial, pintura, impermeabilização, coberturas, pisos e revestimentos, elétrica, hidráulica e adequações de ambientes.

Também podemos assumir o planejamento e gerenciamento da execução, coordenando equipes, materiais, etapas e cronograma para reduzir impactos na operação do cliente.

Gostaríamos de deixar a BEZEL à disposição para demandas atuais ou futuras. Se houver alguma necessidade, podemos realizar uma visita técnica sem compromisso.

Atenciosamente,
BEZEL | Engenharia • Arquitetura • Gestão de Obras
(12) 99183-6206
@grupobezel
bezel.com.br`,
  },
} as const;

type TemplateKey = keyof typeof TEMPLATES;


function interpretar(valor: string) {
  return valor.split(/\r?\n/).map((x) => x.trim()).filter(Boolean).map((linha) => {
    if (linha.includes("|")) {
      const [nome, email] = linha.split("|", 2);
      return { nome: nome.trim(), email: email.trim() };
    }
    const match = linha.match(/^(.+?)\s*<([^>]+)>$/);
    return match ? { nome: match[1].trim(), email: match[2].trim() } : { nome: "", email: linha };
  });
}

function dataLocal(valor?: string) {
  if (!valor) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(valor));
}

export default function EmailCRMClient() {
  const router = useRouter();
  const [aba, setAba] = useState<"dashboard" | "hunter" | "enviar" | "contatos" | "historico">("dashboard");
  const [dados, setDados] = useState<Dashboard | null>(null);
  const [erroBase, setErroBase] = useState("");
  const [carregandoBase, setCarregandoBase] = useState(true);
  const [destinatarios, setDestinatarios] = useState("");
  const [template, setTemplate] = useState<TemplateKey>("geral");
  const [assunto, setAssunto] = useState<string>(TEMPLATES.geral.assunto);
  const [mensagem, setMensagem] = useState<string>(TEMPLATES.geral.mensagem);
  const [confirmacao, setConfirmacao] = useState(false);
  const [enviando, setEnviando] = useState<"teste" | "envio" | null>(null);
  const [resultado, setResultado] = useState("");
  const [emailTeste, setEmailTeste] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroSegmento, setFiltroSegmento] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [filtroOrigem, setFiltroOrigem] = useState("");
  const [filtroEmail, setFiltroEmail] = useState<"" | "com" | "sem">("");
  const [novo, setNovo] = useState({ nome: "", email: "", cidade: "", segmento: "Geral" });
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [excluindoSelecionados, setExcluindoSelecionados] = useState(false);
  const contatosDigitados = useMemo(() => interpretar(destinatarios), [destinatarios]);

  async function carregar() {
    setCarregandoBase(true);
    setErroBase("");
    try {
      const r = await fetch("/api/prospeccao/dashboard", { cache: "no-store" });
      if (r.status === 401) { router.replace("/email/login"); return; }
      const json = await r.json();
      if (!r.ok) { setErroBase(json.error || "Não foi possível carregar a base."); return; }
      setDados(json);
    } catch {
      setErroBase("Erro de comunicação com o servidor.");
    } finally {
      setCarregandoBase(false);
    }
  }

  useEffect(() => { void carregar(); }, []);

  async function sair() {
    await fetch("/api/email-logout", { method: "POST" });
    router.replace("/email/login");
    router.refresh();
  }

  async function enviar(e: FormEvent, teste: boolean) {
    e.preventDefault();
    setResultado("");
    if (!teste && (contatosDigitados.length < 1 || contatosDigitados.length > 20)) {
      setResultado("Informe entre 1 e 20 destinatários.");
      return;
    }
    setEnviando(teste ? "teste" : "envio");
    try {
      const r = await fetch("/api/email-prospeccao", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assunto, mensagem,
          contatos: teste
            ? [{
                nome: contatosDigitados[0]?.nome || "",
                email: emailTeste || contatosDigitados[0]?.email || "teste@bezel.com.br",
              }]
            : contatosDigitados,
          teste,
          emailTeste: teste && emailTeste.trim() ? emailTeste.trim() : undefined,
          confirmacao,
        }),
      });
      if (r.status === 401) { router.replace("/email/login"); return; }
      const json = await r.json();
      if (!r.ok) { setResultado(json.error || "Não foi possível realizar o envio."); return; }
      setResultado(teste
        ? `SMTP aceitou o teste para ${json.destinatarioTeste || "a caixa da BEZEL"}. Isso confirma o aceite pelo servidor de saída; confira também spam/lixo eletrônico no destinatário.`
        : `Processado: ${json.totalEnviados} aceito(s) pelo SMTP, ${json.totalFalhas} falha(s), ${json.totalBloqueados || 0} bloqueado(s). Restam ${json.restantesHoje} hoje.${json.totalFalhas ? ` Falhas: ${(json.falhas || []).map((item: { email: string; erro: string }) => `${item.email}: ${item.erro}`).join(" | ")}` : ""}`
      );
      if (!teste) { setDestinatarios(""); setSelecionados([]); await carregar(); }
    } catch {
      setResultado("Erro de comunicação com o servidor.");
    } finally {
      setEnviando(null);
    }
  }

  async function criarContato(e: FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/prospeccao/contatos", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(novo),
    });
    if (r.ok) { setNovo({ nome: "", email: "", cidade: "", segmento: "Geral" }); await carregar(); }
  }

  async function atualizar(id: string, patch: Record<string, unknown>) {
    const r = await fetch("/api/prospeccao/contatos", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }),
    });
    if (r.ok) {
      if (patch.optOut === true) setSelecionados((atuais) => atuais.filter((x) => x !== id));
      await carregar();
    }
  }

  async function excluirContato(id: string, nome: string) {
    if (!window.confirm(`Excluir "${nome || "este contato"}" definitivamente da base?`)) return;
    const r = await fetch("/api/prospeccao/contatos", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }),
    });
    if (r.ok) {
      setSelecionados((atuais) => atuais.filter((x) => x !== id));
      await carregar();
    }
  }

  async function excluirSelecionados() {
    if (selecionados.length === 0 || excluindoSelecionados) return;
    const quantidade = selecionados.length;
    if (!window.confirm(
      `Excluir definitivamente ${quantidade} contato(s) selecionado(s)? Esta ação não pode ser desfeita.`
    )) return;

    setExcluindoSelecionados(true);
    try {
      const r = await fetch("/api/prospeccao/contatos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selecionados }),
      });
      if (!r.ok) {
        const json = await r.json().catch(() => ({}));
        window.alert(json.error || "Não foi possível excluir os contatos selecionados.");
        return;
      }
      setSelecionados([]);
      await carregar();
    } finally {
      setExcluindoSelecionados(false);
    }
  }

  const segmentos = Array.from(new Set(
    (dados?.contatos || []).map((c) => normalizarSegmento(c.segmento))
  )).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const cidades = Array.from(new Set((dados?.contatos || []).map((c) => c.cidade).filter(Boolean) as string[])).sort();

  const filtrados = (dados?.contatos || []).filter((c) => {
    const texto = `${c.nome} ${c.email || ""} ${c.cidade || ""} ${c.segmento || ""} ${c.telefone || ""} ${c.whatsapp || ""}`.toLowerCase();
    if (!texto.includes(busca.toLowerCase())) return false;
    if (filtroSegmento && normalizarSegmento(c.segmento) !== filtroSegmento) return false;
    if (filtroCidade && c.cidade !== filtroCidade) return false;
    if (filtroOrigem && (c.origem || "Manual") !== filtroOrigem) return false;
    if (filtroEmail === "com" && !c.email) return false;
    if (filtroEmail === "sem" && c.email) return false;
    return true;
  });

  const todosVisiveisSelecionados = filtrados.length > 0 &&
    filtrados.every((c) => selecionados.includes(c._id));
  const selecionadosParaEnvio = (dados?.contatos || []).filter(
    (c) => selecionados.includes(c._id) && !c.optOut && Boolean(c.email)
  );

  function alternarContato(id: string) {
    setSelecionados((atuais) =>
      atuais.includes(id) ? atuais.filter((x) => x !== id) : [...atuais, id]
    );
  }

  function alternarTodosVisiveis() {
    const idsVisiveis = new Set(filtrados.map((c) => c._id));
    if (todosVisiveisSelecionados) {
      setSelecionados((atuais) => atuais.filter((id) => !idsVisiveis.has(id)));
      return;
    }
    setSelecionados((atuais) => [...new Set([...atuais, ...idsVisiveis])]);
  }

  function prepararEnvioSelecionados() {
    if (selecionadosParaEnvio.length < 1 || selecionadosParaEnvio.length > 20) return;
    setDestinatarios(selecionadosParaEnvio.map((c) => `${c.nome} | ${c.email!}`).join("\n"));
    setResultado("");
    setAba("enviar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function aplicarTemplate(chave: TemplateKey) {
    setTemplate(chave);
    setAssunto(TEMPLATES[chave].assunto);
    setMensagem(TEMPLATES[chave].mensagem);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f2ed] px-3 py-4 text-[#1c1c1c] sm:px-4 sm:py-8">
      <div className="mx-auto w-full min-w-0 max-w-7xl">
        <header className="rounded-2xl bg-[#193451] p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-display text-3xl tracking-wider text-[#c3a06a]">BEZEL</div>
              <h1 className="mt-1 text-xl font-semibold">CRM de Prospecção</h1>
            </div>
            <button onClick={sair} className="rounded-lg border border-white/30 px-4 py-2 text-sm">Sair</button>
          </div>
          <nav className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap">
            {[
              ["dashboard","Dashboard"],["hunter","Hunter"],["contatos","Contatos"],["enviar","Enviar e-mail"],["historico","Histórico"]
            ].map(([id,label]) => (
              <button key={id} onClick={() => setAba(id as typeof aba)}
                className={`min-w-0 rounded-lg px-3 py-2.5 text-sm font-semibold sm:px-4 sm:py-2 ${aba === id ? "bg-[#c3a06a] text-[#193451]" : "bg-white/10 text-white"}`}>
                {label}
              </button>
            ))}
          </nav>
        </header>

        {erroBase && (
          <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{erroBase}</div>
        )}

        {aba === "dashboard" && (
          <section className="mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Contatos", dados?.metricas.totalContatos ?? "—"],
                ["Enviados hoje", dados ? `${dados.metricas.enviadosHoje}/${dados.metricas.limiteDiario}` : "—"],
                ["Restantes hoje", dados?.metricas.restantesHoje ?? "—"],
                ["Follow-ups", dados?.metricas.followUpsPendentes ?? "—"],
                ["Não enviar", dados?.metricas.optOut ?? "—"],
              ].map(([label,value]) => (
                <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
                  <div className="mt-2 text-3xl font-bold text-[#193451]">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-[#193451]">Funil comercial</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STATUS.filter((s) => s.value !== "ARQUIVADO").map((s) => (
                  <div key={s.value} className="rounded-xl bg-[#f5f2ed] p-4">
                    <div className="text-sm text-slate-600">{s.label}</div>
                    <div className="mt-1 text-2xl font-bold text-[#193451]">{dados?.metricas.porStatus[s.value] || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {aba === "hunter" && <HunterPanel onAtualizar={carregar} />}

        {aba === "enviar" && (
          <form className="mt-6 grid gap-5" onSubmit={(e) => enviar(e, false)}>
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex justify-between gap-3">
                <div>
                  <label className="text-sm font-semibold text-[#193451]">Destinatários</label>
                  <p className="mt-1 text-xs text-slate-500">Um por linha: Nome ou empresa | email@dominio.com</p>
                </div>
                <span className="text-sm font-semibold text-[#193451]">{contatosDigitados.length}/20</span>
              </div>
              <textarea value={destinatarios} onChange={(e) => setDestinatarios(e.target.value)} rows={7}
                className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-[#c3a06a]" />
              {contatosDigitados.length > 0 && (
                <div className="mt-3 rounded-lg bg-[#f5f2ed] px-4 py-3 text-xs text-[#193451]">
                  Prévia do primeiro destinatário: <strong>{contatosDigitados[0].nome ? `Olá, ${contatosDigitados[0].nome}.` : "Olá."}</strong>
                </div>
              )}
            </section>
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <label className="text-sm font-semibold text-[#193451]">Modelo de mensagem</label>
              <select value={template} onChange={(e) => aplicarTemplate(e.target.value as TemplateKey)}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#c3a06a]">
                {Object.entries(TEMPLATES).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
              </select>
              <p className="mt-2 text-xs text-slate-500">O modelo preenche assunto e mensagem; você pode editar tudo antes de enviar.</p>
              <label className="mt-5 block text-sm font-semibold text-[#193451]">Assunto</label>
              <input value={assunto} onChange={(e) => setAssunto(e.target.value)} maxLength={180}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#c3a06a]" />
              <label className="mt-5 block text-sm font-semibold text-[#193451]">Mensagem</label>
              <p className="mt-1 text-xs text-slate-500">Use {"{{nome}}"} para personalizar.</p>
              <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={18} maxLength={12000}
                className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#c3a06a]" />
            </section>
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <label className="flex gap-3 text-sm text-slate-700">
                <input type="checkbox" checked={confirmacao} onChange={(e) => setConfirmacao(e.target.checked)} className="mt-1 accent-[#193451]" />
                <span>Confirmo que estes contatos foram selecionados para prospecção comercial ou relacionamento profissional da BEZEL.</span>
              </label>
              <div className="mt-5">
                <label className="block max-w-md text-sm font-semibold text-[#193451]">E-mail para teste
                  <input type="email" value={emailTeste} onChange={(e) => setEmailTeste(e.target.value)}
                    placeholder="Deixe vazio para testar na própria caixa BEZEL"
                    className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-[#c3a06a]" />
                </label>
                <p className="mt-2 text-xs text-slate-500">Para validar entrega externa, informe aqui um Gmail, Outlook ou outro endereço fora da caixa remetente.</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" disabled={!!enviando || !confirmacao} onClick={(e) => void enviar(e as unknown as FormEvent, true)}
                  className="rounded-xl border border-[#193451] px-5 py-3 text-sm font-semibold text-[#193451] disabled:opacity-40">
                  {enviando === "teste" ? "Enviando..." : "Enviar teste"}
                </button>
                <button type="submit" disabled={!!enviando || !confirmacao || contatosDigitados.length < 1 || contatosDigitados.length > 20}
                  className="rounded-xl bg-[#193451] px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">
                  {enviando === "envio" ? "Enviando..." : `Enviar para ${contatosDigitados.length}`}
                </button>
              </div>
              {resultado && <div className="mt-4 rounded-xl bg-[#f5f2ed] p-4 text-sm text-[#193451]">{resultado}</div>}
            </section>
          </form>
        )}

        {aba === "contatos" && (
          <section className="mt-6 grid min-w-0 gap-5">
            <form onSubmit={criarContato} className="grid min-w-0 gap-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5 md:grid-cols-5">
              <input required placeholder="Nome / empresa" value={novo.nome} onChange={(e) => setNovo({...novo,nome:e.target.value})} className="rounded-lg border p-3 text-sm" />
              <input required type="email" placeholder="E-mail" value={novo.email} onChange={(e) => setNovo({...novo,email:e.target.value})} className="rounded-lg border p-3 text-sm" />
              <input placeholder="Cidade" value={novo.cidade} onChange={(e) => setNovo({...novo,cidade:e.target.value})} className="rounded-lg border p-3 text-sm" />
              <input placeholder="Segmento" value={novo.segmento} onChange={(e) => setNovo({...novo,segmento:e.target.value})} className="rounded-lg border p-3 text-sm" />
              <button className="rounded-lg bg-[#193451] px-4 py-3 text-sm font-semibold text-white">Adicionar contato</button>
            </form>
            <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <input placeholder="Buscar por nome, e-mail, cidade ou segmento..." value={busca} onChange={(e) => setBusca(e.target.value)}
                  className="w-full min-w-0 rounded-lg border p-3 text-sm lg:max-w-md" />
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={alternarTodosVisiveis}
                    className="rounded-lg border border-[#193451] px-3 py-2 text-xs font-semibold text-[#193451]">
                    {todosVisiveisSelecionados ? "Desmarcar visíveis" : "Selecionar visíveis"}
                  </button>
                  <button type="button"
                    disabled={selecionadosParaEnvio.length === 0 || selecionadosParaEnvio.length > 20}
                    onClick={prepararEnvioSelecionados}
                    className="rounded-lg bg-[#193451] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">
                    Enviar e-mail ({selecionadosParaEnvio.length} apto(s))
                  </button>
                  <button type="button" disabled={selecionados.length === 0 || excluindoSelecionados}
                    onClick={() => void excluirSelecionados()}
                    className="rounded-lg border border-red-300 px-4 py-2 text-xs font-semibold text-red-700 disabled:opacity-40">
                    {excluindoSelecionados ? "Excluindo..." : `Excluir selecionados (${selecionados.length})`}
                  </button>
                </div>
              </div>
              <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <select value={filtroSegmento} onChange={(e) => setFiltroSegmento(e.target.value)} className="rounded-lg border p-2.5 text-sm">
                  <option value="">Todos os segmentos</option>{segmentos.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
                <select value={filtroCidade} onChange={(e) => setFiltroCidade(e.target.value)} className="rounded-lg border p-2.5 text-sm">
                  <option value="">Todas as cidades</option>{cidades.map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
                <select value={filtroOrigem} onChange={(e) => setFiltroOrigem(e.target.value)} className="rounded-lg border p-2.5 text-sm">
                  <option value="">Todas as origens</option><option value="Hunter">Hunter</option><option value="Manual">Manual</option>
                </select>
                <select value={filtroEmail} onChange={(e) => setFiltroEmail(e.target.value as "" | "com" | "sem")} className="rounded-lg border p-2.5 text-sm">
                  <option value="">Com e sem e-mail</option><option value="com">Somente com e-mail</option><option value="sem">Somente sem e-mail</option>
                </select>
              </div>
              <p className="mb-4 text-xs text-slate-500">A seleção serve para envio e exclusão. Para e-mail, o máximo continua sendo 20 por disparo e somente contatos com e-mail e envio permitido são considerados.</p>

              <div className="grid gap-3 md:hidden">
                {filtrados.map((c) => (
                  <article key={c._id} className={`min-w-0 rounded-xl border p-4 ${selecionados.includes(c._id) ? "border-[#c3a06a] bg-[#fffaf0]" : "border-slate-200"}`}>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" aria-label={`Selecionar ${c.nome}`} checked={selecionados.includes(c._id)}
                        onChange={() => alternarContato(c._id)}
                        className="mt-1 h-5 w-5 shrink-0 accent-[#193451]" />
                      <div className="min-w-0">
                        <div className="break-words font-semibold text-[#193451]">{c.nome || "Sem nome"}</div>
                        <div className="mt-0.5 break-all text-xs text-slate-500">{c.email || "Sem e-mail"}</div>
                        <div className="mt-1 text-xs text-slate-500">{c.segmento || "Geral"} · {c.origem || "Manual"}</div>
                        {c.telefone && <div className="mt-1 text-xs text-slate-500">Tel.: {c.telefone}</div>}
                        {c.whatsapp && <div className="mt-1 text-xs text-slate-500">WhatsApp: {c.whatsapp}</div>}
                        {c.site && <a href={c.site} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs font-semibold text-[#193451] underline">Abrir site</a>}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                      <div><span className="block text-slate-500">Cidade</span><span>{c.cidade || "—"}</span></div>
                      <div><span className="block text-slate-500">Último contato</span><span>{dataLocal(c.ultimoContatoEm)}</span></div>
                    </div>
                    <label className="mt-3 block text-xs text-slate-500">Status</label>
                    <select value={c.status} onChange={(e) => void atualizar(c._id,{status:e.target.value})}
                      className="mt-1 w-full min-w-0 rounded-lg border p-2.5 text-sm">
                      {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <label className="mt-3 block text-xs text-slate-500">Próximo follow-up</label>
                    <input type="datetime-local" value={c.proximoFollowUpEm ? c.proximoFollowUpEm.slice(0,16) : ""}
                      onChange={(e) => void atualizar(c._id,{proximoFollowUpEm:e.target.value ? new Date(e.target.value).toISOString() : null})}
                      className="mt-1 w-full min-w-0 rounded-lg border p-2.5 text-sm" />
                    <button type="button" onClick={() => void atualizar(c._id,{optOut:!c.optOut})}
                      className={`mt-3 w-full rounded-lg px-3 py-2.5 text-xs font-semibold ${c.optOut ? "bg-red-100 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {c.optOut ? "Bloqueado para envio" : "Envio permitido"}
                    </button>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => void atualizar(c._id,{status:"ARQUIVADO"})} className="rounded-lg border px-3 py-2 text-xs font-semibold">Arquivar</button>
                      <button type="button" onClick={() => void excluirContato(c._id,c.nome)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700">Excluir</button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead><tr className="border-b text-xs uppercase text-slate-500">
                    <th className="p-3"><input type="checkbox" aria-label="Selecionar contatos visíveis" checked={todosVisiveisSelecionados}
                      onChange={alternarTodosVisiveis} className="h-4 w-4 accent-[#193451]" /></th>
                    <th className="p-3">Contato</th><th className="p-3">Cidade</th><th className="p-3">Status</th>
                    <th className="p-3">Último contato</th><th className="p-3">Follow-up</th><th className="p-3">Envio</th>
                  </tr></thead>
                  <tbody>
                    {filtrados.map((c) => (
                      <tr key={c._id} className={`border-b border-slate-100 ${selecionados.includes(c._id) ? "bg-[#fffaf0]" : ""}`}>
                        <td className="p-3"><input type="checkbox" aria-label={`Selecionar ${c.nome}`} checked={selecionados.includes(c._id)}
                          onChange={() => alternarContato(c._id)} className="h-4 w-4 accent-[#193451]" /></td>
                        <td className="p-3"><div className="font-semibold text-[#193451]">{c.nome || "Sem nome"}</div><div className="text-xs text-slate-500">{c.email || "Sem e-mail"}</div><div className="mt-1 text-xs text-slate-400">{c.segmento || "Geral"} · {c.origem || "Manual"}</div>{c.telefone && <div className="mt-1 text-xs text-slate-400">Tel.: {c.telefone}</div>}{c.site && <a href={c.site} target="_blank" rel="noreferrer" className="mt-1 block text-xs font-semibold text-[#193451] underline">Site</a>}</td>
                        <td className="p-3">{c.cidade || "—"}</td>
                        <td className="p-3"><select value={c.status} onChange={(e) => void atualizar(c._id,{status:e.target.value})} className="rounded-lg border p-2">
                          {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select></td>
                        <td className="p-3">{dataLocal(c.ultimoContatoEm)}</td>
                        <td className="p-3"><input type="datetime-local" value={c.proximoFollowUpEm ? c.proximoFollowUpEm.slice(0,16) : ""}
                          onChange={(e) => void atualizar(c._id,{proximoFollowUpEm:e.target.value ? new Date(e.target.value).toISOString() : null})}
                          className="rounded-lg border p-2" /></td>
                        <td className="p-3"><button type="button" onClick={() => void atualizar(c._id,{optOut:!c.optOut})}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold ${c.optOut ? "bg-red-100 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                          {c.optOut ? "Bloqueado" : "Permitido"}
                        </button>
                        <button type="button" onClick={() => void excluirContato(c._id,c.nome)} className="ml-2 text-xs font-semibold text-red-700">Excluir</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {aba === "historico" && (
          <section className="mt-6 min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
            <h2 className="font-semibold text-[#193451]">Últimos envios</h2>
            <div className="mt-4 grid gap-3 md:hidden">
              {(dados?.historico || []).map((h) => (
                <article key={h._id} className="min-w-0 rounded-xl border border-slate-200 p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-[#193451]">{h.nome || "—"}</div>
                      <div className="break-all text-xs text-slate-500">{h.email}</div>
                    </div>
                    <span className="shrink-0 text-xs font-semibold">{h.status}</span>
                  </div>
                  <div className="mt-3 text-xs text-slate-500">{dataLocal(h.enviadoEm)}</div>
                  <div className="mt-2 break-words text-sm">{h.assunto || "—"}</div>
                  {h.erro && <div className="mt-2 break-words text-xs text-red-700">{h.erro}</div>}
                  {h.smtpResponse && <div className="mt-2 break-words text-xs text-slate-500">SMTP: {h.smtpResponse}</div>}
                </article>
              ))}
            </div>
            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-slate-500">
                  <th className="p-3">Data</th><th className="p-3">Destinatário</th><th className="p-3">Assunto</th><th className="p-3">Status</th>
                </tr></thead>
                <tbody>{(dados?.historico || []).map((h) => (
                  <tr key={h._id} className="border-b border-slate-100">
                    <td className="p-3">{dataLocal(h.enviadoEm)}</td>
                    <td className="p-3"><div>{h.nome || "—"}</div><div className="text-xs text-slate-500">{h.email}</div></td>
                    <td className="p-3">{h.assunto || "—"}</td>
                    <td className="p-3"><div className="font-semibold">{h.status}</div>{h.erro && <div className="mt-1 max-w-xs text-xs text-red-700">{h.erro}</div>}{h.smtpResponse && <div className="mt-1 max-w-xs text-xs text-slate-500">SMTP: {h.smtpResponse}</div>}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>
        )}

        {carregandoBase && <div className="mt-6 text-sm text-slate-500">Carregando base de prospecção...</div>}
      </div>
    </main>
  );
}
