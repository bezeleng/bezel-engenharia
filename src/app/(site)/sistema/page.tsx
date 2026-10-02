import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SistemaProductMockup } from "@/components/sistema/SistemaProductMockup";

export const metadata: Metadata = {
  title: "BEZEL Gestão | Software para Gestão de Obras",
  description:
    "Gestão de obras integrada para construtoras, engenheiros, arquitetos e equipes da construção civil. Planejamento, execução, compras, financeiro, documentos, comercial e inteligência operacional em um só ambiente.",
  alternates: { canonical: "/sistema" },
  openGraph: {
    title: "BEZEL Gestão | Gestão de obras com inteligência",
    description:
      "Controle, organização, visibilidade e inteligência operacional para transformar dados da obra em gestão.",
    url: "/sistema",
    type: "website",
  },
};

const modulos = [
  {
    numero: "01",
    titulo: "Planejamento e execução",
    descricao:
      "Obras, cronograma e Diário de Obra conectados para acompanhar o planejado, o realizado e o que precisa de atenção.",
    itens: ["Obras", "Cronograma", "Diário de Obra"],
  },
  {
    numero: "02",
    titulo: "Compras e financeiro",
    descricao:
      "Solicitações, cotações, aprovações, pedidos, recebimentos e visão financeira organizados dentro do contexto de cada obra.",
    itens: ["Compras", "Cotações", "Financeiro"],
  },
  {
    numero: "03",
    titulo: "Comercial e viabilidade",
    descricao:
      "Da oportunidade ao contrato: EVF, cenários, proposta comercial e formalização sem perder o histórico da decisão.",
    itens: ["Comercial", "EVF", "Propostas", "Contratos"],
  },
  {
    numero: "04",
    titulo: "Equipe, documentos e cliente",
    descricao:
      "Acessos por empresa e obra, biblioteca de documentos, compartilhamentos controlados e acompanhamento do cliente.",
    itens: ["Equipe", "Documentos", "Portal do Cliente"],
  },
];

const beneficios = [
  ["Tudo nasce dentro da obra", "Dados, decisões e históricos permanecem contextualizados por empresa e por obra."],
  ["Rastreabilidade para decidir melhor", "Cronograma, diário, compras, financeiro, documentos e comercial preservam histórico e contexto."],
  ["Construído para a construção", "A lógica parte do fluxo real: oportunidade, viabilidade, contratação, execução, acompanhamento e pós-obra."],
  ["Multiempresa por arquitetura", "Empresas, usuários, papéis e acessos são separados por contexto operacional."],
  ["Web hoje. Mobile no caminho.", "A experiência web é responsiva; o aplicativo nativo está em desenvolvimento."],
  ["Inteligência com contexto", "A BEL está sendo construída sobre dados do próprio BEZEL e uma base técnica dedicada."],
];

const fluxo = ["Oportunidade", "EVF", "Proposta", "Contrato", "Planejamento", "Execução", "Diário", "Compras", "Financeiro", "Pós-obra"];

const faqs = [
  ["Para quem é o BEZEL Gestão?", "Para construtoras, escritórios, engenheiros, arquitetos e gestores que precisam organizar obras, equipes, documentos, compras, financeiro e decisões em um único ambiente."],
  ["Posso gerenciar várias obras?", "Sim. O BEZEL foi estruturado para trabalhar com múltiplas obras e com separação de contexto por empresa e por obra."],
  ["Posso convidar minha equipe?", "Sim. O sistema possui estrutura de equipe, vínculos por empresa e papéis de acesso relacionados às obras."],
  ["O cliente consegue acompanhar a obra?", "O BEZEL possui Portal do Cliente e estrutura de compartilhamento de informações e documentos. A disponibilidade depende do que a empresa publica para o cliente."],
  ["O que é a BEL?", "A BEL é a camada inteligente do BEZEL. Ela está em evolução e foi projetada para interpretar contexto operacional e conhecimento técnico sem ser apenas um chatbot."],
  ["Funciona no celular?", "A versão web é responsiva e pode ser acessada pelo navegador. O aplicativo nativo BEZEL Mobile está em desenvolvimento."],
  ["Existe período de teste?", "A oferta comercial de teste ainda não foi publicada. Quando o formato estiver definido, a página será atualizada."],
  ["Meus dados ficam separados de outras empresas?", "A arquitetura foi construída com isolamento multiempresa e controle de acesso por contexto."],
  ["Preciso instalar alguma coisa?", "Para usar a versão web, não. O acesso é feito pelo navegador."],
];

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SistemaPage() {
  return (
    <div className="overflow-hidden bg-[#F8F7F4] text-navy">
      <section className="relative isolate border-b border-navy/10 bg-white">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-70"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 75% 15%, rgba(195,160,106,.16), transparent 32%), radial-gradient(circle at 25% 0%, rgba(24,52,81,.08), transparent 28%)",
          }}
        />
        <Container className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-text">
              BEZEL Gestão
              <span className="h-1 w-1 rounded-full bg-gold" />
              Software para gestão de obras
            </div>
            <h1 className="max-w-xl font-display text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
              A obra gera dados todos os dias. Transforme isso em gestão.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-navy/70 sm:text-lg">
              Planejamento, execução, compras, financeiro, documentos e comercial em um ambiente criado para quem vive a obra — com a BEL, a gestora inteligente do BEZEL, evoluindo junto à operação.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#como-funciona" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy transition hover:bg-gold/90">
                Conhecer o BEZEL <ArrowRight />
              </Link>
              <Link href="/contato" className="inline-flex min-h-12 items-center justify-center rounded-full border border-navy/20 bg-white px-7 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/[0.03]">
                Falar com a equipe
              </Link>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 border-t border-navy/10 pt-6">
              {[
                ["Integrado", "Dados por obra"],
                ["Multiempresa", "Acessos por contexto"],
                ["BEL", "Inteligência com contexto"],
              ].map(([titulo, descricao]) => (
                <div key={titulo}>
                  <p className="text-sm font-semibold text-navy">{titulo}</p>
                  <p className="mt-1 text-xs leading-5 text-navy/55">{descricao}</p>
                </div>
              ))}
            </div>
          </div>
          <SistemaProductMockup />
        </Container>
      </section>

      <section className="bg-navy py-8 text-white">
        <Container>
          <div className="grid gap-5 text-center sm:grid-cols-4 sm:text-left">
            {[
              ["Controle", "menos informação espalhada"],
              ["Organização", "processos com contexto"],
              ["Visibilidade", "sinais antes da decisão"],
              ["Inteligência", "dados conectados à operação"],
            ].map(([titulo, descricao]) => (
              <div key={titulo} className="border-white/10 sm:border-l sm:pl-5 first:border-l-0 first:pl-0">
                <p className="font-display text-lg text-gold">{titulo}</p>
                <p className="mt-1 text-sm text-white/60">{descricao}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="bel" className="relative overflow-hidden border-b border-navy/10 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(circle at 22% 55%, rgba(195,160,106,.18), transparent 28%), radial-gradient(circle at 82% 22%, rgba(91,71,108,.12), transparent 30%)",
          }}
        />
        <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-24">
          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute inset-x-8 bottom-5 h-20 rounded-full bg-navy/10 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[32px] border border-gold/30 bg-white shadow-[0_30px_80px_rgba(24,52,81,0.13)]">
              <img
                src="/bel/bel-mascote.webp"
                alt="BEL, gestora inteligente do BEZEL Gestão"
                width="640"
                height="960"
                loading="eager"
                decoding="async"
                className="h-auto w-full"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#6F5A86]/20 bg-white px-4 py-2 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#7C6592]" />
              <span className="whitespace-nowrap text-xs font-semibold text-[#5F4975]">BEL · Em evolução</span>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-text">
                Conheça a BEL
              </span>
              <span className="rounded-full bg-[#EEE9F5] px-3 py-1 text-xs font-semibold text-[#604A79]">
                Inteligência do BEZEL
              </span>
            </div>
            <h2 className="mt-5 font-display text-4xl leading-[1.08] text-navy sm:text-5xl">
              Prazer, eu sou a BEL.
            </h2>
            <p className="mt-3 text-xl font-medium text-navy/80">
              A gestora inteligente do BEZEL Gestão.
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-navy/65">
              A BEL foi criada para trabalhar com o contexto real da operação — fatos do sistema, histórico da obra e conhecimento técnico estruturado — ajudando a transformar informação espalhada em sinais mais úteis para gestão.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ["Contexto operacional", "Obras, cronograma, diário e outros dados do sistema."],
                ["Conhecimento técnico", "Base dedicada para apoiar análises com referência."],
                ["Radar e sinais", "Interpretações derivadas com origem e nível de confiança."],
                ["Evolução contínua", "Novas experiências são liberadas somente quando estiverem validadas."],
              ].map(([titulo, descricao]) => (
                <div key={titulo} className="rounded-2xl border border-navy/10 bg-[#F8F7F4] p-4">
                  <p className="text-sm font-semibold text-navy">{titulo}</p>
                  <p className="mt-1.5 text-xs leading-5 text-navy/55">{descricao}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[24px] border border-[#6F5A86]/15 bg-[#F7F4FA] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6A547D]">
                O tipo de pergunta que guia a experiência
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Bel, como está a obra?",
                  "O que precisa da minha atenção hoje?",
                  "Existe alguma etapa atrasada?",
                  "O que o Diário registrou ontem?",
                ].map((pergunta) => (
                  <span key={pergunta} className="rounded-full border border-[#6F5A86]/15 bg-white px-3 py-2 text-xs text-[#4E3D60]">
                    “{pergunta}”
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-5 max-w-xl text-xs leading-5 text-navy/45">
              A BEL está em evolução. Recursos do Radar e outras experiências inteligentes só são apresentados como disponíveis quando estiverem efetivamente liberados no produto.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">O problema não é falta de informação</span>
              <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight text-navy sm:text-4xl">
                É quando cada parte da obra vive em um lugar diferente.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-navy/65">
              Mensagens no WhatsApp, planilhas isoladas, papel, arquivos espalhados, compras sem histórico e decisões financeiras sem a mesma visão da execução. O BEZEL foi desenhado para aproximar essas informações sem transformar a rotina em burocracia.
            </p>
          </div>
        </Container>
      </section>

      <section id="como-funciona" className="border-y border-navy/10 bg-white py-20 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">Um sistema. Várias etapas. O mesmo contexto.</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
              O BEZEL acompanha a obra antes, durante e depois da execução.
            </h2>
            <p className="mt-5 text-base leading-7 text-navy/65">
              Em vez de criar ilhas de informação, o produto organiza módulos diferentes ao redor da mesma operação.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {modulos.map((modulo) => (
              <article key={modulo.numero} className="rounded-[28px] border border-navy/10 bg-[#FBFAF7] p-7 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_55px_rgba(24,52,81,0.08)] sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="font-display text-2xl text-gold">{modulo.numero}</span>
                  <div className="h-px flex-1 translate-y-4 bg-navy/10" />
                </div>
                <h3 className="mt-7 font-display text-2xl text-navy">{modulo.titulo}</h3>
                <p className="mt-3 leading-7 text-navy/60">{modulo.descricao}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {modulo.itens.map((item) => (
                    <span key={item} className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-medium text-navy/70">{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="rounded-[32px] bg-navy px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-14">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <span className="inline-flex rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">Fluxo conectado</span>
                <h2 className="mt-5 max-w-xl font-display text-3xl leading-tight sm:text-4xl">
                  A informação acompanha a obra. Não fica presa em um módulo.
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-white/65">
                  O valor do BEZEL está menos em ter muitas telas e mais em organizar etapas diferentes dentro de uma mesma operação, preservando contexto e histórico.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {fluxo.map((item, index) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/85">{item}</span>
                    {index < fluxo.length - 1 && <span className="text-gold/70" aria-hidden="true">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">Diferenciais</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
              Tecnologia suficiente para organizar. Sem transformar a obra em ERP antigo.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {beneficios.map(([titulo, descricao]) => (
              <article key={titulo} className="rounded-[24px] border border-navy/10 bg-white p-6 shadow-[0_14px_40px_rgba(24,52,81,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-text">✓</div>
                <h3 className="mt-5 text-lg font-semibold text-navy">{titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-navy/60">{descricao}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-navy/10 bg-white py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">BEZEL Mobile</span>
              <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">BEZEL onde a obra acontece.</h2>
              <p className="mt-5 max-w-xl leading-7 text-navy/65">
                A experiência web já se adapta a telas menores. O aplicativo nativo está em desenvolvimento e esta seção ficará pronta para receber os links oficiais da Google Play e da App Store quando eles existirem.
              </p>
              <span className="mt-6 inline-flex rounded-full border border-navy/10 bg-[#F8F7F4] px-4 py-2 text-xs font-semibold text-navy/60">Aplicativo em desenvolvimento</span>
            </div>
            <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-5">
              {[0, 1].map((item) => (
                <div key={item} className={`rounded-[32px] border-[7px] border-navy bg-white p-3 shadow-[0_25px_65px_rgba(24,52,81,0.16)] ${item === 1 ? "translate-y-8" : ""}`}>
                  <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-navy/15" />
                  <div className={`rounded-2xl p-3 ${item === 1 ? "bg-navy" : "bg-[#F4F1EA]"}`}>
                    <div className="h-2 w-14 rounded-full bg-gold/60" />
                    <div className={`mt-3 h-7 w-24 rounded ${item === 1 ? "bg-white/80" : "bg-navy/90"}`} />
                    <div className="mt-5 grid gap-2">
                      {[1, 2, 3].map((card) => <div key={card} className={`h-12 rounded-xl ${item === 1 ? "bg-white/[0.08]" : "bg-white shadow-sm"}`} />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">Planos</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">Uma estrutura preparada para crescer com a operação.</h2>
            <p className="mt-5 leading-7 text-navy/65">
              START, PRO e BUSINESS já fazem parte da estrutura comercial do produto. Preços, limites e composição final de recursos ainda serão publicados.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              ["START", "Para operações que estão estruturando a gestão digital de obras.", false],
              ["PRO", "Para equipes que precisam ampliar controle, colaboração e acompanhamento.", true],
              ["BUSINESS", "Para operações com maior escala, múltiplas frentes e necessidades de gestão mais avançadas.", false],
            ].map(([nome, publico, destaque]) => (
              <article key={String(nome)} className={`relative flex min-h-[330px] flex-col rounded-[28px] border p-7 ${destaque ? "border-gold bg-navy text-white shadow-[0_28px_70px_rgba(24,52,81,0.16)]" : "border-navy/10 bg-white text-navy"}`}>
                {destaque && <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">Destaque</span>}
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${destaque ? "text-gold" : "text-gold-text"}`}>Plano</p>
                <h3 className="mt-3 font-display text-3xl">{nome}</h3>
                <p className={`mt-5 text-sm leading-6 ${destaque ? "text-white/65" : "text-navy/60"}`}>{publico}</p>
                <div className="mt-auto pt-8">
                  <p className={`text-sm font-semibold ${destaque ? "text-gold" : "text-navy"}`}>Preço em breve</p>
                  <Link href="/contato" className={`mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${destaque ? "bg-gold text-navy hover:bg-gold/90" : "border border-navy/20 text-navy hover:bg-navy hover:text-white"}`}>
                    Quero conhecer
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-navy py-20 text-white sm:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Perguntas frequentes</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Entenda o produto antes de levar mais um sistema para a obra.</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 border-y border-white/10">
            {faqs.map(([pergunta, resposta]) => (
              <details key={pergunta} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-semibold text-white">
                  {pergunta}
                  <span className="text-xl font-light text-gold transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-7 text-white/60">{resposta}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#F5F2ED] py-20 sm:py-24">
        <Container>
          <div className="rounded-[32px] border border-gold/30 bg-white px-6 py-10 text-center shadow-[0_24px_70px_rgba(24,52,81,0.07)] sm:px-10 sm:py-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">Menos fragmentação. Mais gestão.</span>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl leading-tight text-navy sm:text-5xl">
              Sua obra já produz dados todos os dias. O BEZEL organiza esses dados para você enxergar melhor a operação.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-7 text-navy/60">
              Conheça o produto, acompanhe a evolução da BEL e converse com a equipe sobre a entrada do BEZEL na sua rotina.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contato" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy transition hover:bg-gold/90">
                Falar sobre o BEZEL Gestão <ArrowRight />
              </Link>
              <Link href="#como-funciona" className="inline-flex min-h-12 items-center justify-center rounded-full border border-navy/20 px-7 py-3 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white">
                Rever como funciona
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
