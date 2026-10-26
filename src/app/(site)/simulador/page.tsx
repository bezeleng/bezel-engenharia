import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SimuladorObra } from "@/components/forms/SimuladorObra";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";
import { simuladorHeroImageData } from "@/lib/simulador-hero-image";

export const metadata: Metadata = {
  title: "Simulador de Investimento da Obra",
  description:
    "Faça uma simulação preliminar de investimento para sua obra e entenda quais informações influenciam o orçamento.",
  alternates: {
    canonical: "/simulador",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Simulador de Investimento da Obra | BEZEL",
    description:
      "Uma estimativa preliminar para ajudar no planejamento da sua obra antes de solicitar uma análise personalizada.",
    url: "https://bezel.com.br/simulador",
    type: "website",
  },
};

export default async function SimuladorPage() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });

  return (
    <>
      <section className="bg-navy py-16 text-white sm:py-20">
        <Container className="max-w-4xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Planejamento inicial
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl sm:text-5xl">
            Simulador de investimento da sua obra
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/75">
            Informe alguns dados básicos e receba uma faixa preliminar para orientar o planejamento. O resultado não substitui orçamento, projeto, levantamento do terreno ou análise técnica.
          </p>
        </Container>
      </section>

      <section className="bg-neutral-50 pt-10 sm:pt-14">
        <Container>
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl border border-black/5 bg-neutral-200 shadow-lg">
            <Image
              src={simuladorHeroImageData}
              alt="Residência contemporânea com piscina ao pôr do sol e plantas de projeto em primeiro plano"
              fill
              unoptimized
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 py-14 sm:py-20">
        <Container>
          <SimuladorObra whatsapp={config?.whatsapp} />
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <span className="text-sm font-semibold text-gold-text">01</span>
              <h2 className="mt-2 font-display text-xl text-navy">É uma referência inicial</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                O simulador ajuda a organizar expectativas antes de uma análise detalhada.
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gold-text">02</span>
              <h2 className="mt-2 font-display text-xl text-navy">Cada terreno é diferente</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                Topografia, fundação, acesso, legislação e características do projeto influenciam diretamente o investimento.
              </p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gold-text">03</span>
              <h2 className="mt-2 font-display text-xl text-navy">A análise técnica vem depois</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy/65">
                Com os dados da simulação, a equipe consegue começar a conversa já entendendo melhor o perfil da obra.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
