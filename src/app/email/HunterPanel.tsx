"use client";

import { FormEvent, useEffect, useState } from "react";

type ResultadoHunter = {
  dominio: string; cadastrado: boolean; novo?: boolean; nome: string; email?: string;
  telefone?: string; site?: string; instagram?: string; motivo?: string;
};

export default function HunterPanel({ onAtualizar }: { onAtualizar: () => Promise<void> }) {
  const [segmento, setSegmento] = useState("Escolas");
  const [localidade, setLocalidade] = useState("São José dos Campos, SP");
  const [quantidade, setQuantidade] = useState(10);
  const [buscarEmail, setBuscarEmail] = useState(true);
  const [buscarTelefone, setBuscarTelefone] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [resultados, setResultados] = useState<ResultadoHunter[]>([]);
  const [continuacao, setContinuacao] = useState<{ chave: string; dominios: string[] }>({ chave: "", dominios: [] });

  useEffect(() => {
    try {
      const salvo = sessionStorage.getItem("bezel-prospeccao-continuacao");
      if (!salvo) return;
      const parsed = JSON.parse(salvo) as { chave?: unknown; dominios?: unknown };
      if (typeof parsed.chave === "string" && Array.isArray(parsed.dominios)) {
        setContinuacao({
          chave: parsed.chave,
          dominios: parsed.dominios.filter((dominio): dominio is string => typeof dominio === "string"),
        });
      }
    } catch {
      sessionStorage.removeItem("bezel-prospeccao-continuacao");
    }
  }, []);

  function salvarContinuacao(proxima: { chave: string; dominios: string[] }) {
    setContinuacao(proxima);
    try {
      if (proxima.dominios.length) {
        sessionStorage.setItem("bezel-prospeccao-continuacao", JSON.stringify(proxima));
      } else {
        sessionStorage.removeItem("bezel-prospeccao-continuacao");
      }
    } catch {
      // A busca continua funcionando mesmo se o navegador bloquear sessionStorage.
    }
  }

  async function buscar(e: FormEvent) {
    e.preventDefault();
    setBuscando(true); setMensagem(""); setResultados([]);
    const chaveBusca = JSON.stringify({
      segmento: segmento.trim().toLowerCase(),
      localidade: localidade.trim().toLowerCase(),
      quantidade,
      buscarEmail,
      buscarTelefone,
    });
    const dominiosAnalisados = continuacao.chave === chaveBusca ? continuacao.dominios : [];
    try {
      const r = await fetch("/api/prospeccao/hunter", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ segmento, localidade, quantidade, buscarEmail, buscarTelefone, dominiosAnalisados }),
      });
      const json = await r.json();
      if (!r.ok) { setMensagem(json.error || "Não foi possível executar a busca."); return; }
      setResultados(json.resultados || []);
      const analisadosNestaRodada = Array.isArray(json.dominiosAnalisadosRodada) ? json.dominiosAnalisadosRodada : [];
      salvarContinuacao({
        chave: chaveBusca,
        dominios: json.continuacaoDisponivel
          ? [...new Set([...dominiosAnalisados, ...analisadosNestaRodada])]
          : [],
      });
      const foursquare = json.foursquareConfigurado
        ? ` Foursquare encontrou ${json.fichasFoursquareEncontradas || 0} ficha(s): ${json.fichasFoursquareComSite || 0} com site, ${json.fichasFoursquareComEmailCorporativo || 0} via e-mail corporativo e ${json.dominiosFoursquareViaHunter || 0} via Domain Finder. Total: ${json.encontradosFoursquare || 0} candidato(s) com domínio.`
        : " Foursquare ainda não está configurado; a descoberta ficou limitada ao Hunter.";
      const erroFoursquare = Array.isArray(json.errosFoursquare) && json.errosFoursquare.length
        ? ` Atenção Foursquare: ${json.errosFoursquare[0]}`
        : "";
      const falhasDomainFinder = Array.isArray(json.falhasDomainFinder) ? json.falhasDomainFinder : [];
      const diagnosticoDomainFinder = falhasDomainFinder.length
        ? ` Atenção Domain Finder: ${falhasDomainFinder.map((item: { status?: number; quantidade?: number }) => {
            const status = Number(item.status || 0);
            const quantidadeFalhas = Number(item.quantidade || 0);
            const motivo = status === 429
              ? "limite de uso/créditos do Hunter"
              : status === 403
                ? "limite de requisições do Hunter"
                : `HTTP ${status || "desconhecido"}`;
            return `${quantidadeFalhas} falha(s) por ${motivo}`;
          }).join(", ")}.`
        : "";
      const continuacaoLote = json.continuacaoDisponivel
        ? ` A próxima busca com estes mesmos filtros ignorará os ${json.totalDominiosAnalisados || 0} domínio(s) já analisado(s) e seguirá pelos ${json.candidatosRestantes || 0} restante(s), mesmo que o pool mude de ordem.`
        : dominiosAnalisados.length > 0
          ? " O pool chegou ao fim; a próxima busca reiniciará um novo ciclo."
          : "";
      const diagnosticoDescarte = (json.descartados || 0) > 0
        ? ` Motivos do descarte: ${json.descartadosSiteIndisponivel || 0} site(s) indisponível(is) para validação, ${json.descartadosSemEvidenciaCondominial || 0} sem evidência de administração condominial no site, ${json.descartadosAderencia || 0} por aderência insuficiente e ${json.descartadosLocalidade || 0} por localidade incompatível.`
        : "";
      if (json.nenhumResultado) {
        setMensagem(`${json.mensagem || "Nenhuma empresa encontrada. Tente ampliar o segmento ou usar uma cidade próxima."}${diagnosticoDescarte}${continuacaoLote}${foursquare}${erroFoursquare}${diagnosticoDomainFinder}`);
      } else {
        const qualificados = json.qualificados ?? ((json.cadastrados || 0) + (json.jaExistentes || 0));
        const detalhe = json.tentativas > 1 ? ` Hunter consultado em ${json.tentativas} estratégias.` : "";
        const funil = json.analisados > 0
          ? ` Foram analisados ${json.analisados} candidato(s): ${qualificados} qualificado(s) e ${json.descartados || 0} descartado(s) por baixa aderência ao segmento ou localidade.`
          : "";
        const semEmail = json.semEmail > 0
          ? ` Entre os ${qualificados} qualificado(s), ${json.semEmail} ${json.semEmail === 1 ? "ficou" : "ficaram"} sem e-mail profissional.`
          : "";
        const pool = json.candidatosUnicos > 0
          ? ` Pool combinado: ${json.candidatosUnicos} candidato(s) único(s) com domínio — ${json.candidatosNovosNoPool || 0} ainda não cadastrado(s) e ${json.candidatosJaCadastradosNoPool || 0} já no CRM.`
          : "";
        const limite = json.limiteAnaliseAtingido
          ? ` A rodada atingiu o limite seguro de ${json.limiteAnalise} análises antes de completar a quantidade pedida.`
          : "";
        setMensagem(`Busca qualificada: ${json.cadastrados} novo(s) e ${json.jaExistentes} já existente(s).${semEmail}${funil}${diagnosticoDescarte}${pool}${limite}${continuacaoLote}${detalhe}${foursquare}${erroFoursquare}${diagnosticoDomainFinder}`);
      }
      await onAtualizar();
    } catch {
      setMensagem("Erro de comunicação ao executar o Hunter.");
    } finally {
      setBuscando(false);
    }
  }

  return (
    <section className="mt-6 grid gap-5">
      <form onSubmit={buscar} className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold text-[#193451]">Busca de prospecção</h2>
          <p className="mt-2 text-sm text-slate-600">Informe o segmento e a localidade. O sistema encontra empresas e cadastra os resultados diretamente na base para você filtrar depois.</p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="text-sm font-semibold text-[#193451]">Segmento
            <input required value={segmento} onChange={(e) => setSegmento(e.target.value)} placeholder="Ex.: Escolas, arquitetos, clínicas" className="mt-2 w-full rounded-lg border p-3 font-normal text-slate-900" />
          </label>
          <label className="text-sm font-semibold text-[#193451]">Localidade
            <input required value={localidade} onChange={(e) => setLocalidade(e.target.value)} placeholder="Ex.: Jacareí, SP" className="mt-2 w-full rounded-lg border p-3 font-normal text-slate-900" />
          </label>
          <label className="text-sm font-semibold text-[#193451]">Quantidade
            <select value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} className="mt-2 w-full rounded-lg border p-3 font-normal text-slate-900">
              {[5,10,15,20].map((x) => <option key={x} value={x}>{x} empresas</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={buscarEmail} onChange={(e) => setBuscarEmail(e.target.checked)} className="accent-[#193451]" /> Buscar e-mail profissional</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={buscarTelefone} onChange={(e) => setBuscarTelefone(e.target.checked)} className="accent-[#193451]" /> Buscar telefone da empresa</label>
        </div>
        <button disabled={buscando} className="mt-5 rounded-xl bg-[#193451] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {buscando ? "Buscando e cadastrando..." : "Buscar e cadastrar"}
        </button>
        <p className="mt-3 text-xs text-slate-500">A descoberta combina Foursquare Places para localizar empresas e Hunter para enriquecer domínio, e-mail e dados profissionais. Antes de cadastrar, o sistema valida a aderência da empresa. Em buscas de administração condominial, a atividade precisa estar comprovada no próprio site; resultados apenas relacionados a condomínios são descartados. Se houver poucas empresas realmente qualificadas, o sistema retorna menos resultados em vez de completar com leads ruins. Telefone não é marcado como WhatsApp sem confirmação específica.</p>
        {mensagem && <div className="mt-4 rounded-xl bg-[#f5f2ed] p-4 text-sm text-[#193451]">{mensagem}</div>}
      </form>

      {resultados.length > 0 && (
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
          <h3 className="font-semibold text-[#193451]">Resultado da última busca</h3>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {resultados.map((r) => (
              <article key={r.dominio} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="break-words font-semibold text-[#193451]">{r.nome}</div>
                    <div className="mt-1 break-all text-xs text-slate-500">{r.dominio}</div>
                    <div className="mt-2 break-all text-sm">{r.email || "Sem e-mail encontrado"}</div>
                    {r.telefone && <div className="mt-1 text-sm">Telefone: {r.telefone}</div>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${r.novo ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                    {r.novo ? "Novo" : "Já existia"}
                  </span>
                </div>
                {r.site && <a href={r.site} target="_blank" rel="noreferrer" className="mt-3 block break-all text-xs font-semibold text-[#193451] underline">Abrir site</a>}
                {r.instagram && <a href={r.instagram} target="_blank" rel="noreferrer" className="mt-2 block break-all text-xs font-semibold text-[#193451] underline">Abrir Instagram</a>}
                {r.motivo && <p className="mt-3 text-xs text-slate-500">{r.motivo}</p>}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
