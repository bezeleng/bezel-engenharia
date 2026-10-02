import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SistemaProductMockup } from "@/components/sistema/SistemaProductMockup";
import { sanityFetch } from "@/sanity/lib/live";
import { paginaSistemaQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

type ItemTexto = { _key?: string; titulo?: string | null; descricao?: string | null };
type Modulo = ItemTexto & { numero?: string | null; itens?: (string | null)[] | null };
type Plano = {
  _key?: string;
  nome?: string | null;
  publico?: string | null;
  preco?: string | null;
  observacaoPreco?: string | null;
  recursos?: (string | null)[] | null;
  destaque?: boolean | null;
  textoBotao?: string | null;
  linkBotao?: string | null;
};
type Faq = { _key?: string; pergunta?: string | null; resposta?: string | null };
type PaginaSistema = {
  badgeHero?: string | null;
  tituloHero?: string | null;
  subtituloHero?: string | null;
  textoCtaPrimario?: string | null;
  linkCtaPrimario?: string | null;
  textoCtaSecundario?: string | null;
  linkCtaSecundario?: string | null;
  heroDestaques?: ItemTexto[] | null;
  belImagem?: Parameters<typeof urlFor>[0] | null;
  belTitulo?: string | null;
  belSubtitulo?: string | null;
  belDescricao?: string | null;
  belStatus?: string | null;
  belPilares?: ItemTexto[] | null;
  belPerguntas?: (string | null)[] | null;
  belAviso?: string | null;
  tituloProblema?: string | null;
  textoProblema?: string | null;
  tituloModulos?: string | null;
  textoModulos?: string | null;
  modulos?: Modulo[] | null;
  tituloFluxo?: string | null;
  textoFluxo?: string | null;
  fluxo?: (string | null)[] | null;
  tituloDiferenciais?: string | null;
  diferenciais?: ItemTexto[] | null;
  tituloPlanos?: string | null;
  textoPlanos?: string | null;
  planos?: Plano[] | null;
  tituloMobile?: string | null;
  textoMobile?: string | null;
  statusMobile?: string | null;
  googlePlayUrl?: string | null;
  appStoreUrl?: string | null;
  tituloFaq?: string | null;
  faqs?: Faq[] | null;
  tituloCtaFinal?: string | null;
  textoCtaFinal?: string | null;
  textoBotaoCtaFinal?: string | null;
  linkBotaoCtaFinal?: string | null;
  seo?: {
    metaTitulo?: string | null;
    metaDescricao?: string | null;
    imagemOg?: Parameters<typeof urlFor>[0] | null;
  } | null;
};

const DEFAULTS: {
  heroDestaques: ItemTexto[];
  belPilares: ItemTexto[];
  belPerguntas: string[];
  modulos: Modulo[];
  fluxo: string[];
  diferenciais: ItemTexto[];
  planos: Plano[];
  faqs: Faq[];
} = {
  heroDestaques: [
    { titulo: "Tudo em um lugar", descricao: "Obra, equipe, compras e custos" },
    { titulo: "Menos improviso", descricao: "Histórico e responsabilidades claras" },
    { titulo: "BEL", descricao: "Ajuda a encontrar o que exige atenção" },
  ],
  belPilares: [
    { titulo: "O que está acontecendo?", descricao: "A BEL usa os registros da própria obra para ajudar você a entender a situação." },
    { titulo: "O que merece atenção?", descricao: "Ela ajuda a reunir sinais e informações relevantes antes que virem surpresa." },
    { titulo: "Onde procurar primeiro?", descricao: "Em vez de vasculhar telas, você começa pelo que parece mais importante." },
    { titulo: "Cada vez mais útil", descricao: "A BEL continua evoluindo conforme novas funções são validadas no produto." },
  ],
  belPerguntas: [
    "Bel, como está a obra?",
    "O que precisa da minha atenção hoje?",
    "Existe alguma etapa atrasada?",
    "O que o Diário registrou ontem?",
  ],
  modulos: [
    {
      numero: "01",
      titulo: "Saiba se a obra está andando",
      descricao: "Organize tarefas, responsáveis, prazos e registros do dia. Veja o planejado e o que realmente aconteceu.",
      itens: ["Obras", "Cronograma", "Diário de Obra"],
    },
    {
      numero: "02",
      titulo: "Pare de perder dinheiro no caminho",
      descricao: "Acompanhe solicitações, cotações, compras, recebimentos e movimentações financeiras vinculadas à obra.",
      itens: ["Compras", "Cotações", "Financeiro"],
    },
    {
      numero: "03",
      titulo: "Venda a obra com mais segurança",
      descricao: "Organize oportunidades, estudos de viabilidade, propostas e contratos antes de a execução começar.",
      itens: ["Comercial", "EVF", "Propostas", "Contratos"],
    },
    {
      numero: "04",
      titulo: "Todo mundo sabe onde encontrar",
      descricao: "Equipe, documentos e informações do cliente ficam organizados na obra certa, com acesso conforme a necessidade.",
      itens: ["Equipe", "Documentos", "Portal do Cliente"],
    },
  ],
  fluxo: ["Oportunidade", "EVF", "Proposta", "Contrato", "Planejamento", "Execução", "Diário", "Compras", "Financeiro", "Pós-obra"],
  diferenciais: [
    { titulo: "Você sabe onde está a informação", descricao: "Cada registro fica ligado à obra certa, em vez de espalhado em mensagens, pastas e planilhas." },
    { titulo: "Você entende o que aconteceu", descricao: "Cronograma, diário, compras, financeiro e documentos mantêm o histórico para reduzir dúvida e retrabalho." },
    { titulo: "Feito para quem vive obra", descricao: "A organização acompanha o caminho real: orçamento, contrato, planejamento, execução e entrega." },
    { titulo: "Cada pessoa vê o que precisa", descricao: "Organize equipes e acessos sem misturar informações de empresas e obras diferentes." },
    { titulo: "Funciona no escritório e na obra", descricao: "Use pelo navegador no computador ou celular; o aplicativo nativo está em desenvolvimento." },
    { titulo: "A BEL trabalha com a sua realidade", descricao: "A inteligência parte das informações registradas no BEZEL para ajudar a enxergar o que merece atenção." },
  ],
  planos: [
    { nome: "START", publico: "Para operações que estão estruturando a gestão digital de obras.", preco: "Preço em breve", destaque: false, textoBotao: "Quero conhecer", linkBotao: "/contato" },
    { nome: "PRO", publico: "Para equipes que precisam ampliar controle, colaboração e acompanhamento.", preco: "Preço em breve", destaque: true, textoBotao: "Quero conhecer", linkBotao: "/contato" },
    { nome: "BUSINESS", publico: "Para operações com maior escala, múltiplas frentes e necessidades de gestão mais avançadas.", preco: "Preço em breve", destaque: false, textoBotao: "Quero conhecer", linkBotao: "/contato" },
  ],
  faqs: [
    { pergunta: "Para quem é o BEZEL Gestão?", resposta: "Para construtoras, escritórios, engenheiros, arquitetos e gestores que precisam organizar obras, equipes, documentos, compras, financeiro e decisões em um único ambiente." },
    { pergunta: "Posso gerenciar várias obras?", resposta: "Sim. O BEZEL foi estruturado para trabalhar com múltiplas obras e com separação de contexto por empresa e por obra." },
    { pergunta: "Posso convidar minha equipe?", resposta: "Sim. O sistema possui estrutura de equipe, vínculos por empresa e papéis de acesso relacionados às obras." },
    { pergunta: "O cliente consegue acompanhar a obra?", resposta: "O BEZEL possui Portal do Cliente e estrutura de compartilhamento de informações e documentos. A disponibilidade depende do que a empresa publica para o cliente." },
    { pergunta: "O que é a BEL?", resposta: "A BEL é a camada inteligente do BEZEL. Ela está em evolução e foi projetada para interpretar contexto operacional e conhecimento técnico sem ser apenas um chatbot." },
    { pergunta: "Funciona no celular?", resposta: "A versão web é responsiva e pode ser acessada pelo navegador. O aplicativo nativo BEZEL Mobile está em desenvolvimento." },
    { pergunta: "Existe período de teste?", resposta: "A oferta comercial de teste ainda não foi publicada. Quando o formato estiver definido, a página será atualizada." },
    { pergunta: "Meus dados ficam separados de outras empresas?", resposta: "A arquitetura foi construída com isolamento multiempresa e controle de acesso por contexto." },
    { pergunta: "Preciso instalar alguma coisa?", resposta: "Para usar a versão web, não. O acesso é feito pelo navegador." },
  ],
};

async function getPaginaSistema() {
  const { data } = await sanityFetch({ query: paginaSistemaQuery });
  return data as PaginaSistema | null;
}

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPaginaSistema();
  const title = pagina?.seo?.metaTitulo || "BEZEL Gestão | Software para Gestão de Obras";
  const description =
    pagina?.seo?.metaDescricao ||
    "Gestão de obras integrada para construtoras, engenheiros, arquitetos e equipes da construção civil. Planejamento, execução, compras, financeiro, documentos, comercial e inteligência operacional em um só ambiente.";
  const ogImage = pagina?.seo?.imagemOg
    ? urlFor(pagina.seo.imagemOg).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: "/sistema" },
    openGraph: {
      title,
      description,
      url: "/sistema",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function marketingText(
  value: string | null | undefined,
  legacy: string,
  replacement: string,
) {
  return !value || value === legacy ? replacement : value;
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function SistemaPage() {
  const pagina = await getPaginaSistema();

  const heroDestaques = pagina?.heroDestaques?.length ? pagina.heroDestaques : DEFAULTS.heroDestaques;
  const belPilares = pagina?.belPilares?.length ? pagina.belPilares : DEFAULTS.belPilares;
  const belPerguntas = pagina?.belPerguntas?.filter(Boolean) as string[] | undefined;
  const modulos = pagina?.modulos?.length ? pagina.modulos : DEFAULTS.modulos;
  const fluxo = pagina?.fluxo?.filter(Boolean) as string[] | undefined;
  const diferenciais = pagina?.diferenciais?.length ? pagina.diferenciais : DEFAULTS.diferenciais;
  const planos = pagina?.planos?.length ? pagina.planos : DEFAULTS.planos;
  const faqs = pagina?.faqs?.length ? pagina.faqs : DEFAULTS.faqs;

  const belImagemUrl = pagina?.belImagem
    ? urlFor(pagina.belImagem).width(900).height(1350).fit("max").auto("format").url()
    : null;

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
              {pagina?.badgeHero || "BEZEL Gestão · Software para gestão de obras"}
            </div>
            <h1 className="max-w-xl font-display text-4xl leading-[1.08] text-navy sm:text-5xl lg:text-6xl">
              {marketingText(
                pagina?.tituloHero,
                "A obra gera dados todos os dias. Transforme isso em gestão.",
                "Pare de apagar incêndios na obra. Tenha tudo sob controle em um só lugar.",
              )}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-navy/85 sm:text-lg">
              {marketingText(
                pagina?.subtituloHero,
                "Planejamento, execução, compras, financeiro, documentos e comercial em um ambiente criado para quem vive a obra — com a BEL, a gestora inteligente do BEZEL, evoluindo junto à operação.",
                "Saiba o que está atrasado, o que foi comprado, quanto já foi gasto, o que aconteceu hoje na obra e o que precisa da sua atenção — sem depender de planilhas, grupos de WhatsApp e informação espalhada.",
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={pagina?.linkCtaPrimario || "#como-funciona"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy transition hover:bg-gold/90">
                {pagina?.textoCtaPrimario || "Conhecer o BEZEL"} <ArrowRight />
              </Link>
              <Link href={pagina?.linkCtaSecundario || "/contato"} className="inline-flex min-h-12 items-center justify-center rounded-full border border-navy/20 bg-white px-7 py-3 text-sm font-semibold text-navy transition hover:border-navy/40 hover:bg-navy/[0.03]">
                {pagina?.textoCtaSecundario || "Falar com a equipe"}
              </Link>
            </div>
            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 border-t border-navy/10 pt-6">
              {heroDestaques.slice(0, 3).map((item, index) => (
                <div key={item._key || item.titulo || index}>
                  <p className="text-sm font-semibold text-navy">{item.titulo}</p>
                  <p className="mt-1 text-xs leading-5 text-navy/70">{item.descricao}</p>
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
                <p className="mt-1 text-sm text-white/80">{descricao}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="bel" className="relative overflow-hidden border-b border-navy/10 bg-white">
        <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" style={{ background: "radial-gradient(circle at 22% 55%, rgba(195,160,106,.18), transparent 28%), radial-gradient(circle at 82% 22%, rgba(91,71,108,.12), transparent 30%)" }} />
        <Container className="relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-24">
          <div className="relative mx-auto w-full max-w-[430px]">
            <div className="absolute inset-x-8 bottom-5 h-20 rounded-full bg-navy/10 blur-3xl" aria-hidden="true" />
            <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-[32px] border border-gold/30 bg-[#F8F7F4] shadow-[0_30px_80px_rgba(24,52,81,0.13)]">
              {belImagemUrl ? (
                <Image
                  src={belImagemUrl}
                  alt="BEL, gestora inteligente do BEZEL Gestão"
                  width={900}
                  height={1350}
                  sizes="(max-width: 1024px) 80vw, 430px"
                  className="h-auto w-full"
                  priority
                />
              ) : (
                <div className="px-8 text-center">
                  <p className="font-display text-5xl text-gold">BEL</p>
                  <p className="mt-4 text-sm leading-6 text-navy/70">
                    Adicione a foto da BEL em Studio → Landing BEZEL Gestão → BEL.
                  </p>
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#6F5A86]/20 bg-white px-4 py-2 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#7C6592]" />
              <span className="whitespace-nowrap text-xs font-semibold text-[#5F4975]">
                BEL · {pagina?.belStatus || "Em evolução"}
              </span>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-text">Conheça a BEL</span>
              <span className="rounded-full bg-[#EEE9F5] px-3 py-1 text-xs font-semibold text-[#604A79]">Inteligência do BEZEL</span>
            </div>
            <h2 className="mt-5 font-display text-4xl leading-[1.08] text-navy sm:text-5xl">
              {marketingText(pagina?.belTitulo, "Prazer, eu sou a BEL.", "Conheça a BEL. A inteligência que ajuda você a enxergar a obra antes do problema crescer.")}
            </h2>
            <p className="mt-3 text-xl font-medium text-navy/80">
              {marketingText(pagina?.belSubtitulo, "A gestora inteligente do BEZEL Gestão.", "Pergunte. Confira. Decida. A BEL ajuda você a entender o que está acontecendo sem precisar procurar informação em dez lugares.")}
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-navy/80">
              {marketingText(
                pagina?.belDescricao,
                "A BEL foi criada para trabalhar com o contexto real da operação — fatos do sistema, histórico da obra e conhecimento técnico estruturado — ajudando a transformar informação espalhada em sinais mais úteis para gestão.",
                "Ela cruza as informações registradas no BEZEL para ajudar você a entender atrasos, pendências, acontecimentos do dia e pontos que merecem atenção. É como ter alguém acompanhando a operação com você — sem substituir sua decisão.",
              )}
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {belPilares.map((item, index) => (
                <div key={item._key || item.titulo || index} className="rounded-2xl border border-navy/10 bg-[#F8F7F4] p-4">
                  <p className="text-sm font-semibold text-navy">{item.titulo}</p>
                  <p className="mt-1.5 text-xs leading-5 text-navy/70">{item.descricao}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[24px] border border-[#6F5A86]/15 bg-[#F7F4FA] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6A547D]">O tipo de pergunta que guia a experiência</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(belPerguntas?.length ? belPerguntas : DEFAULTS.belPerguntas).map((pergunta) => (
                  <span key={pergunta} className="rounded-full border border-[#6F5A86]/15 bg-white px-3 py-2 text-xs text-[#4E3D60]">“{pergunta}”</span>
                ))}
              </div>
            </div>

            <p className="mt-5 max-w-xl text-xs leading-5 text-navy/60">
              {pagina?.belAviso || "A BEL está em evolução. Recursos do Radar e outras experiências inteligentes só são apresentados como disponíveis quando estiverem efetivamente liberados no produto."}
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
                {marketingText(
                  pagina?.tituloProblema,
                  "É quando cada parte da obra vive em um lugar diferente.",
                  "Se você precisa perguntar em cinco grupos diferentes para descobrir como está a obra, você já perdeu o controle.",
                )}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-navy/80">
              {marketingText(
                pagina?.textoProblema,
                "Mensagens no WhatsApp, planilhas isoladas, papel, arquivos espalhados, compras sem histórico e decisões financeiras sem a mesma visão da execução. O BEZEL foi desenhado para aproximar essas informações sem transformar a rotina em burocracia.",
                "Fotos no celular, orçamento em planilha, nota fiscal no e-mail, pedido no WhatsApp, cronograma desatualizado e cliente cobrando resposta. O BEZEL junta a rotina da obra em um único lugar para você parar de procurar informação e começar a gerenciar.",
              )}
            </p>
          </div>
        </Container>
      </section>

      <section id="como-funciona" className="border-y border-navy/10 bg-white py-20 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-text">Um sistema. Várias etapas. O mesmo contexto.</span>
            <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
              {marketingText(
                pagina?.tituloModulos,
                "O BEZEL acompanha a obra antes, durante e depois da execução.",
                "Do primeiro orçamento à entrega da obra: tudo conversa entre si.",
              )}
            </h2>
            <p className="mt-5 text-base leading-7 text-navy/80">
              {marketingText(
                pagina?.textoModulos,
                "Em vez de criar ilhas de informação, o produto organiza módulos diferentes ao redor da mesma operação.",
                "Você não precisa comprar um sistema para cada problema. O BEZEL reúne planejamento, diário, compras, financeiro, documentos, propostas, contratos, equipe e cliente dentro da mesma obra.",
              )}
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {modulos.map((modulo, index) => (
              <article key={modulo._key || modulo.titulo || index} className="rounded-[28px] border border-navy/10 bg-[#FBFAF7] p-7 transition hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_55px_rgba(24,52,81,0.08)] sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="font-display text-2xl text-gold">{modulo.numero || String(index + 1).padStart(2, "0")}</span>
                  <div className="h-px flex-1 translate-y-4 bg-navy/10" />
                </div>
                <h3 className="mt-7 font-display text-2xl text-navy">{modulo.titulo}</h3>
                <p className="mt-3 leading-7 text-navy/75">{modulo.descricao}</p>
                {!!modulo.itens?.length && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {modulo.itens.filter(Boolean).map((item) => (
                      <span key={item as string} className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-medium text-navy/85">{item}</span>
                    ))}
                  </div>
                )}
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
                  {marketingText(
                  pagina?.tituloFluxo,
                  "A informação acompanha a obra. Não fica presa em um módulo.",
                  "A obra deixa de ser um monte de informações soltas e vira uma sequência que você consegue acompanhar.",
                )}
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-white/80">
                  {marketingText(
                  pagina?.textoFluxo,
                  "O valor do BEZEL está menos em ter muitas telas e mais em organizar etapas diferentes dentro de uma mesma operação, preservando contexto e histórico.",
                  "A oportunidade vira proposta. A proposta vira contrato. O contrato vira planejamento. A execução gera diário, compras e movimentação financeira. Você acompanha o caminho completo sem perder o histórico.",
                )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(fluxo?.length ? fluxo : DEFAULTS.fluxo).map((item, index, items) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-white/85">{item}</span>
                    {index < items.length - 1 && <span className="text-gold/70" aria-hidden="true">→</span>}
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
              {marketingText(
                pagina?.tituloDiferenciais,
                "Tecnologia suficiente para organizar. Sem transformar a obra em ERP antigo.",
                "Menos surpresa no fim do mês. Menos cobrança sem resposta. Mais controle durante a obra.",
              )}
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {diferenciais.map((item, index) => (
              <article key={item._key || item.titulo || index} className="rounded-[24px] border border-navy/10 bg-white p-6 shadow-[0_14px_40px_rgba(24,52,81,0.04)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-text">✓</div>
                <h3 className="mt-5 text-lg font-semibold text-navy">{item.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-navy/75">{item.descricao}</p>
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
              <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
                {marketingText(pagina?.tituloMobile, "BEZEL onde a obra acontece.", "A gestão não pode ficar presa no computador do escritório.")}
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-navy/80">
                {marketingText(
                pagina?.textoMobile,
                "A experiência web já se adapta a telas menores. O aplicativo nativo está em desenvolvimento e esta seção ficará pronta para receber os links oficiais da Google Play e da App Store quando eles existirem.",
                "Abra o BEZEL no celular e acompanhe a obra onde ela realmente acontece. A versão web já funciona em telas menores e o aplicativo nativo está em desenvolvimento.",
              )}
              </p>
              <span className="mt-6 inline-flex rounded-full border border-navy/10 bg-[#F8F7F4] px-4 py-2 text-xs font-semibold text-navy/75">
                {pagina?.statusMobile || "Aplicativo em desenvolvimento"}
              </span>
              {(pagina?.googlePlayUrl || pagina?.appStoreUrl) && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {pagina.googlePlayUrl && (
                    <a href={pagina.googlePlayUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white">
                      Google Play
                    </a>
                  )}
                  {pagina.appStoreUrl && (
                    <a href={pagina.appStoreUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white">
                      App Store
                    </a>
                  )}
                </div>
              )}
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
            <h2 className="mt-4 font-display text-3xl leading-tight text-navy sm:text-4xl">
              {marketingText(
                pagina?.tituloPlanos,
                "Uma estrutura preparada para crescer com a operação.",
                "Comece com o que sua operação precisa hoje. Evolua quando suas obras crescerem.",
              )}
            </h2>
            <p className="mt-5 leading-7 text-navy/80">
              {marketingText(
                pagina?.textoPlanos,
                "START, PRO e BUSINESS já fazem parte da estrutura comercial do produto. Preços, limites e composição final de recursos ainda serão publicados.",
                "Escolha o plano que combina com o tamanho da sua operação. Você pode administrar os valores e recursos desta seção diretamente pelo Studio.",
              )}
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {planos.map((plano, index) => (
              <article key={plano._key || plano.nome || index} className={`relative flex min-h-[350px] flex-col rounded-[28px] border p-7 ${plano.destaque ? "border-gold bg-navy text-white shadow-[0_28px_70px_rgba(24,52,81,0.16)]" : "border-navy/10 bg-white text-navy"}`}>
                {plano.destaque && <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">Destaque</span>}
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${plano.destaque ? "text-gold" : "text-gold-text"}`}>Plano</p>
                <h3 className="mt-3 font-display text-3xl">{plano.nome}</h3>
                <p className={`mt-5 text-sm leading-6 ${plano.destaque ? "text-white/80" : "text-navy/75"}`}>{plano.publico}</p>
                {!!plano.recursos?.length && (
                  <ul className={`mt-6 space-y-2 text-sm ${plano.destaque ? "text-white/90" : "text-navy/80"}`}>
                    {plano.recursos.filter(Boolean).map((recurso) => <li key={recurso as string}>✓ {recurso}</li>)}
                  </ul>
                )}
                <div className="mt-auto pt-8">
                  <p className={`text-xl font-semibold ${plano.destaque ? "text-gold" : "text-navy"}`}>{plano.preco || "Preço em breve"}</p>
                  {plano.observacaoPreco && <p className={`mt-1 text-xs ${plano.destaque ? "text-white/70" : "text-navy/60"}`}>{plano.observacaoPreco}</p>}
                  <Link href={plano.linkBotao || "/contato"} className={`mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${plano.destaque ? "bg-gold text-navy hover:bg-gold/90" : "border border-navy/20 text-navy hover:bg-navy hover:text-white"}`}>
                    {plano.textoBotao || "Quero conhecer"}
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
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">
              {marketingText(
                pagina?.tituloFaq,
                "Entenda o produto antes de levar mais um sistema para a obra.",
                "Antes de assinar, tire as dúvidas que realmente importam.",
              )}
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq, index) => (
              <details key={faq._key || faq.pergunta || index} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-semibold text-white">
                  {faq.pergunta}
                  <span className="text-xl font-light text-gold transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pt-4 text-sm leading-7 text-white/80">{faq.resposta}</p>
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
              {marketingText(
                pagina?.tituloCtaFinal,
                "Sua obra já produz dados todos os dias. O BEZEL organiza esses dados para você enxergar melhor a operação.",
                "Você não precisa trabalhar mais para ter controle. Precisa parar de perder informação.",
              )}
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-7 text-navy/75">
              {marketingText(
                pagina?.textoCtaFinal,
                "Conheça o produto, acompanhe a evolução da BEL e converse com a equipe sobre a entrada do BEZEL na sua rotina.",
                "Centralize suas obras, acompanhe equipe, compras, custos, documentos e andamento em um só lugar — e deixe a BEL ajudar você a perceber o que merece atenção.",
              )}
            </p>
            <div className="mt-8">
              <Link href={pagina?.linkBotaoCtaFinal || "/contato"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy transition hover:bg-gold/90">
                {pagina?.textoBotaoCtaFinal || "Falar sobre o BEZEL Gestão"} <ArrowRight />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
