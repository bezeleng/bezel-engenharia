export function SistemaProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -left-5 top-16 h-28 w-28 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-7 bottom-12 h-36 w-36 rounded-full bg-navy/10 blur-3xl" aria-hidden="true" />

      <div className="relative overflow-hidden rounded-[28px] border border-navy/10 bg-[#102A44] p-2 shadow-[0_35px_100px_rgba(24,52,81,0.22)] sm:p-3">
        <div className="flex items-center justify-between rounded-t-[21px] bg-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/80" />
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white/55">
            Prévia conceitual
          </span>
        </div>

        <div className="grid min-h-[420px] grid-cols-[64px_1fr] overflow-hidden rounded-b-[21px] bg-[#F7F6F2] sm:grid-cols-[150px_1fr]">
          <aside className="border-r border-navy/10 bg-white p-3 sm:p-4">
            <div className="mb-7 hidden sm:block">
              <p className="font-display text-sm text-navy">BEZEL</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-navy/35">Gestão</p>
            </div>
            <div className="space-y-2">
              {["Visão geral", "Obras", "Cronograma", "Compras", "Financeiro", "BEL"].map(
                (item, index) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 ${index === 0 ? "bg-navy text-white" : "text-navy/45"}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${index === 0 ? "bg-gold" : "bg-navy/15"}`}
                    />
                    <span className="hidden text-[10px] font-medium sm:block">{item}</span>
                  </div>
                ),
              )}
            </div>
          </aside>

          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-text">
                  Visão geral
                </p>
                <p className="mt-1 text-lg font-semibold text-navy sm:text-xl">Obra Residencial</p>
              </div>
              <span className="rounded-full bg-[#E7F2EA] px-2.5 py-1 text-[9px] font-semibold text-[#41704B]">
                Em execução
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Avanço", "68%"],
                ["Prazo", "14 sem"],
                ["Pendências", "07"],
                ["Financeiro", "OK"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-navy/8 bg-white p-3">
                  <p className="text-[9px] text-navy/40">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-navy">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-2xl border border-navy/8 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-navy">Cronograma</p>
                  <span className="text-[9px] text-navy/35">próximas etapas</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ["Instalações", "78%"],
                    ["Revestimentos", "52%"],
                    ["Pintura", "18%"],
                  ].map(([name, value], index) => (
                    <div key={name}>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-navy/55">{name}</span>
                        <span className="font-medium text-navy">{value}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy/8">
                        <div
                          className="h-full rounded-full bg-gold"
                          style={{ width: `${[78, 52, 18][index]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#5B476C] p-4 text-white">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold">BEL</p>
                  <span className="h-2 w-2 rounded-full bg-[#CFC0DB]" />
                </div>
                <p className="mt-4 text-[11px] leading-5 text-white/80">
                  Existem sinais que merecem revisão antes da próxima etapa.
                </p>
                <div className="mt-4 rounded-xl bg-white/10 p-3 text-[9px] leading-4 text-white/70">
                  Análise e automações em evolução.
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-navy/8 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-navy">Acompanhamento</p>
                <span className="text-[9px] text-gold-text">Hoje</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Diário", "Compras", "Documentos"].map((item) => (
                  <div key={item} className="rounded-xl bg-[#F6F4EF] p-3">
                    <div className="h-1.5 w-6 rounded-full bg-gold/60" />
                    <p className="mt-3 text-[9px] font-medium text-navy/60">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-5 text-navy/40">
        Composição visual ilustrativa da proposta do produto. Não representa uma captura literal de uma tela específica.
      </p>
    </div>
  );
}
