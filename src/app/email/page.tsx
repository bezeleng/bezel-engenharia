"use client";

import { FormEvent, useMemo, useState } from "react";

type Contato = { nome: string; email: string };

function interpretarDestinatarios(valor: string): Contato[] {
  return valor
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean)
    .map((linha) => {
      if (linha.includes("|")) {
        const [nome, email] = linha.split("|", 2);
        return { nome: nome.trim(), email: email.trim() };
      }

      const match = linha.match(/^(.+?)\s*<([^>]+)>$/);
      if (match) return { nome: match[1].trim(), email: match[2].trim() };

      return { nome: "", email: linha };
    });
}

export default function EmailProspeccaoPage() {
  const [senha, setSenha] = useState("");
  const [destinatarios, setDestinatarios] = useState("");
  const [assunto, setAssunto] = useState(
    "Aos cuidados da Administração/Direção — manutenção predial para o recesso escolar"
  );
  const [mensagem, setMensagem] = useState(
    `Prezados(as), bom dia.

Meu nome é Diego e falo em nome da BEZEL Engenharia, Arquitetura e Gestão de Obras.

Com a proximidade do encerramento do ano letivo, estamos entrando em contato com instituições de ensino da região para disponibilizar nossa equipe para o planejamento e execução de serviços durante o período de recesso escolar.

Esse período permite realizar intervenções com menor impacto na rotina da instituição e preparar os ambientes para o início do próximo ano letivo.

Entre os serviços que podemos atender estão pintura interna e externa, recuperação de fachadas, impermeabilização, manutenção de coberturas, pisos e revestimentos, elétrica, hidráulica, adequação de ambientes e reformas em geral.

A BEZEL também realiza o planejamento e gerenciamento da execução, coordenando equipes, materiais, etapas e cronograma.

Gostaríamos de nos colocar à disposição da {{nome}} para uma visita técnica sem compromisso, a fim de conhecer as necessidades atuais ou eventuais manutenções previstas para o próximo recesso e, havendo interesse, apresentar uma proposta.

Caso este assunto seja tratado por outro responsável, poderiam, por gentileza, encaminhar este e-mail à Direção, Administração ou ao setor responsável pela manutenção predial e contratação de obras da instituição?

Agradeço pela atenção e fico à disposição.

Atenciosamente,
BEZEL | Engenharia • Arquitetura • Gestão de Obras
(12) 99183-6206
@grupobezel
bezel.com.br`
  );
  const [confirmacao, setConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState<"teste" | "envio" | null>(null);
  const [resultado, setResultado] = useState("");

  const contatos = useMemo(
    () => interpretarDestinatarios(destinatarios),
    [destinatarios]
  );

  async function enviar(event: FormEvent, teste: boolean) {
    event.preventDefault();
    setResultado("");

    if (!senha) {
      setResultado("Informe a senha do painel.");
      return;
    }

    if (!teste && (contatos.length < 1 || contatos.length > 20)) {
      setResultado("Informe entre 1 e 20 destinatários.");
      return;
    }

    setCarregando(teste ? "teste" : "envio");

    try {
      const response = await fetch("/api/email-prospeccao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senha,
          assunto,
          mensagem,
          contatos: teste
            ? [{ nome: "Instituição de teste", email: "teste@bezel.com.br" }]
            : contatos,
          teste: teste,
          confirmacao,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResultado(data.error || "Não foi possível realizar o envio.");
        return;
      }

      if (teste) {
        setResultado("E-mail de teste enviado para a caixa configurada da BEZEL.");
      } else {
        setResultado(
          `Envio concluído: ${data.totalEnviados} enviado(s), ${data.totalFalhas} falha(s).`
        );
      }
    } catch {
      setResultado("Erro de comunicação com o servidor.");
    } finally {
      setCarregando(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f2ed] px-4 py-10 text-[#1c1c1c]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-2xl bg-[#193451] p-7 text-white shadow-sm">
          <div className="font-display text-3xl tracking-wider text-[#c3a06a]">
            BEZEL
          </div>
          <h1 className="mt-2 text-2xl font-semibold">Painel de Prospecção por E-mail</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-200">
            Envio individual de até 20 contatos por lote. Cada destinatário recebe
            uma mensagem separada.
          </p>
        </header>

        <form className="grid gap-6" onSubmit={(e) => enviar(e, false)}>
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#193451]">
              Senha do painel
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#c3a06a]"
              placeholder="Senha privada da BEZEL"
            />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <label className="block text-sm font-semibold text-[#193451]">
                  Destinatários
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Um por linha. Use Nome da instituição | email@dominio.com para personalizar.
                </p>
              </div>
              <span className={`text-sm font-semibold ${contatos.length > 20 ? "text-red-600" : "text-[#193451]"}`}>
                {contatos.length}/20
              </span>
            </div>
            <textarea
              value={destinatarios}
              onChange={(e) => setDestinatarios(e.target.value)}
              rows={8}
              className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-[#c3a06a]"
              placeholder={"ITJ | contato@itj.g12.br\nColégio Exemplo | contato@colegio.com.br"}
            />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#193451]">
              Assunto
            </label>
            <input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              maxLength={180}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#c3a06a]"
            />

            <label className="mt-6 block text-sm font-semibold text-[#193451]">
              Mensagem
            </label>
            <p className="mt-1 text-xs text-slate-500">
              Use {"{{nome}}"} para inserir automaticamente o nome da instituição.
            </p>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={20}
              maxLength={12000}
              className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#c3a06a]"
            />
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={confirmacao}
                onChange={(e) => setConfirmacao(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#193451]"
              />
              <span>
                Confirmo que os destinatários são contatos institucionais
                selecionados para prospecção comercial relacionada aos serviços da BEZEL.
              </span>
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!!carregando || !confirmacao}
                onClick={(e) => enviar(e as unknown as FormEvent, true)}
                className="rounded-xl border border-[#193451] px-5 py-3 text-sm font-semibold text-[#193451] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {carregando === "teste" ? "Enviando teste..." : "Enviar teste para a BEZEL"}
              </button>
              <button
                type="submit"
                disabled={!!carregando || !confirmacao || contatos.length < 1 || contatos.length > 20}
                className="rounded-xl bg-[#193451] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {carregando === "envio" ? "Enviando..." : `Enviar para ${contatos.length} contato(s)`}
              </button>
            </div>

            {resultado && (
              <div className="mt-5 rounded-xl bg-[#f5f2ed] px-4 py-3 text-sm text-[#193451]">
                {resultado}
              </div>
            )}
          </section>
        </form>
      </div>
    </main>
  );
}
