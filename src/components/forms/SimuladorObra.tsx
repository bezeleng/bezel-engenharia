"use client";

import { useMemo, useState } from "react";

type Padrao = "essencial" | "intermediario" | "superior";
type Sistema = "nao_sei" | "convencional" | "steel_frame" | "blokok";
type Prazo = "ate_3" | "3_6" | "6_12" | "mais_12";

interface SimuladorObraProps {
  whatsapp?: string | null;
}

const PADROES: Record<Padrao, { label: string; valorM2: number; descricao: string }> = {
  essencial: {
    label: "Essencial",
    valorM2: 3000,
    descricao: "Soluções funcionais e acabamento mais objetivo.",
  },
  intermediario: {
    label: "Intermediário",
    valorM2: 4200,
    descricao: "Equilíbrio entre acabamento, conforto e investimento.",
  },
  superior: {
    label: "Superior",
    valorM2: 6000,
    descricao: "Maior nível de acabamento, personalização e especificações.",
  },
};

const SISTEMAS: Record<Sistema, string> = {
  nao_sei: "Ainda não sei",
  convencional: "Construção convencional",
  steel_frame: "Steel Frame",
  blokok: "BlocoK",
};

const PRAZOS: Record<Prazo, string> = {
  ate_3: "Até 3 meses",
  "3_6": "De 3 a 6 meses",
  "6_12": "De 6 a 12 meses",
  mais_12: "Mais de 12 meses",
};

function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function SimuladorObra({ whatsapp }: SimuladorObraProps) {
  const [cidade, setCidade] = useState("");
  const [area, setArea] = useState("");
  const [padrao, setPadrao] = useState<Padrao>("intermediario");
  const [sistema, setSistema] = useState<Sistema>("nao_sei");
  const [prazo, setPrazo] = useState<Prazo>("6_12");
  const [temTerreno, setTemTerreno] = useState<"sim" | "nao">("sim");
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const areaNumero = Number(area.replace(",", "."));

  const estimativa = useMemo(() => {
    if (!Number.isFinite(areaNumero) || areaNumero < 20) return null;

    const base = areaNumero * PADROES[padrao].valorM2;
    return {
      minimo: Math.round(base * 0.85),
      maximo: Math.round(base * 1.15),
    };
  }, [areaNumero, padrao]);

  const podeCalcular =
    cidade.trim().length >= 2 &&
    Number.isFinite(areaNumero) &&
    areaNumero >= 20 &&
    areaNumero <= 2000;

  const mensagemWhatsapp = useMemo(() => {
    if (!estimativa) return "";

    return [
      "Olá! Fiz uma simulação de investimento no site da BEZEL e gostaria de conversar sobre minha obra.",
      "",
      `Cidade: ${cidade}`,
      `Já tenho terreno: ${temTerreno === "sim" ? "Sim" : "Não"}`,
      `Área aproximada: ${areaNumero} m²`,
      `Padrão: ${PADROES[padrao].label}`,
      `Sistema construtivo: ${SISTEMAS[sistema]}`,
      `Previsão para começar: ${PRAZOS[prazo]}`,
      `Faixa preliminar apresentada: ${formatarMoeda(estimativa.minimo)} a ${formatarMoeda(estimativa.maximo)}`,
      "",
      "Quero entender os próximos passos e ter uma análise mais precisa.",
    ].join("\n");
  }, [areaNumero, cidade, estimativa, padrao, prazo, sistema, temTerreno]);

  const linkWhatsapp =
    whatsapp && mensagemWhatsapp
      ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagemWhatsapp)}`
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-7">
          <div>
            <label className="mb-2 block text-sm font-medium text-navy">
              Em qual cidade será a obra?
            </label>
            <input
              value={cidade}
              onChange={(event) => {
                setCidade(event.target.value);
                setMostrarResultado(false);
              }}
              placeholder="Ex.: Jacareí"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-navy outline-none transition focus:border-gold"
            />
          </div>

          <div>
            <span className="mb-3 block text-sm font-medium text-navy">
              Você já possui o terreno?
            </span>
            <div className="grid grid-cols-2 gap-3">
              {(["sim", "nao"] as const).map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  onClick={() => {
                    setTemTerreno(opcao);
                    setMostrarResultado(false);
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                    temTerreno === opcao
                      ? "border-gold bg-gold/10 text-navy"
                      : "border-black/10 text-navy/70 hover:border-gold/60"
                  }`}
                >
                  {opcao === "sim" ? "Sim" : "Ainda não"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy">
              Área aproximada que pretende construir
            </label>
            <div className="relative">
              <input
                inputMode="decimal"
                value={area}
                onChange={(event) => {
                  setArea(event.target.value.replace(/[^0-9,.]/g, ""));
                  setMostrarResultado(false);
                }}
                placeholder="Ex.: 180"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 pr-14 text-navy outline-none transition focus:border-gold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-navy/50">
                m²
              </span>
            </div>
            {area && (!Number.isFinite(areaNumero) || areaNumero < 20 || areaNumero > 2000) && (
              <p className="mt-2 text-sm text-red-700">
                Informe uma área entre 20 e 2.000 m².
              </p>
            )}
          </div>

          <div>
            <span className="mb-3 block text-sm font-medium text-navy">
              Qual padrão de acabamento você imagina?
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.entries(PADROES) as [Padrao, (typeof PADROES)[Padrao]][]).map(
                ([valor, item]) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => {
                      setPadrao(valor);
                      setMostrarResultado(false);
                    }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      padrao === valor
                        ? "border-gold bg-gold/10"
                        : "border-black/10 hover:border-gold/60"
                    }`}
                  >
                    <strong className="block text-sm text-navy">{item.label}</strong>
                    <span className="mt-1 block text-xs leading-relaxed text-navy/60">
                      {item.descricao}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy">
              Sistema construtivo
            </label>
            <select
              value={sistema}
              onChange={(event) => {
                setSistema(event.target.value as Sistema);
                setMostrarResultado(false);
              }}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-navy outline-none transition focus:border-gold"
            >
              {(Object.entries(SISTEMAS) as [Sistema, string][]).map(([valor, label]) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-relaxed text-navy/55">
              Nesta primeira versão, o sistema construtivo qualifica a simulação, mas não altera automaticamente a faixa de investimento.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy">
              Quando pretende começar?
            </label>
            <select
              value={prazo}
              onChange={(event) => {
                setPrazo(event.target.value as Prazo);
                setMostrarResultado(false);
              }}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-navy outline-none transition focus:border-gold"
            >
              {(Object.entries(PRAZOS) as [Prazo, string][]).map(([valor, label]) => (
                <option key={valor} value={valor}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={!podeCalcular}
            onClick={() => setMostrarResultado(true)}
            className="rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Calcular estimativa preliminar
          </button>
        </div>
      </div>

      <aside className="h-fit rounded-3xl bg-navy p-6 text-white shadow-sm sm:p-8 lg:sticky lg:top-28">
        {!mostrarResultado || !estimativa ? (
          <div className="flex min-h-[360px] flex-col justify-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Simulação preliminar
            </span>
            <h2 className="mt-3 font-display text-3xl">
              Tenha uma primeira referência antes de conversar com a equipe.
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Preencha as informações ao lado. O resultado será uma faixa inicial de investimento para ajudar no planejamento — não um orçamento fechado.
            </p>
          </div>
        ) : (
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Faixa estimada
            </span>
            <p className="mt-4 text-sm text-white/65">
              Para aproximadamente {areaNumero} m², padrão {PADROES[padrao].label.toLowerCase()}:
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
              <strong className="block font-display text-3xl text-gold sm:text-4xl">
                {formatarMoeda(estimativa.minimo)}
              </strong>
              <span className="my-2 block text-sm text-white/50">até</span>
              <strong className="block font-display text-3xl text-gold sm:text-4xl">
                {formatarMoeda(estimativa.maximo)}
              </strong>
            </div>

            <div className="mt-5 space-y-2 text-sm text-white/70">
              <p><strong className="text-white">Cidade:</strong> {cidade}</p>
              <p><strong className="text-white">Terreno:</strong> {temTerreno === "sim" ? "já possui" : "ainda não possui"}</p>
              <p><strong className="text-white">Sistema:</strong> {SISTEMAS[sistema]}</p>
              <p><strong className="text-white">Início:</strong> {PRAZOS[prazo]}</p>
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 p-4 text-xs leading-relaxed text-white/60">
              Esta é uma estimativa orientativa baseada apenas em área e padrão de acabamento. Não constitui proposta ou orçamento. Terreno, topografia, fundações, projetos, taxas, contenções, piscina, paisagismo, mobiliário, instalações especiais e especificações podem alterar significativamente o investimento final.
            </div>

            {linkWhatsapp ? (
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold/90"
              >
                Quero uma análise mais precisa
              </a>
            ) : (
              <a
                href="/contato"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy transition hover:bg-gold/90"
              >
                Quero uma análise mais precisa
              </a>
            )}

            <button
              type="button"
              onClick={() => setMostrarResultado(false)}
              className="mt-3 w-full rounded-full border border-white/20 px-6 py-3 text-sm text-white transition hover:border-white/40"
            >
              Ajustar simulação
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
