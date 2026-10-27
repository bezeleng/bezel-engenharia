import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { obrasQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { ObraCard } from "@/components/sections/ObraCard";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Obras e Construção no Vale do Paraíba",
  description:
    "Conheça obras executadas e gerenciadas pela BEZEL em Jacareí, São José dos Campos e demais cidades do Vale do Paraíba.",
  alternates: {
    canonical: "/obras",
  },
  openGraph: {
    title: "Obras e Construção no Vale do Paraíba | BEZEL",
    description:
      "Acompanhe obras da BEZEL do planejamento à execução em Jacareí, São José dos Campos e região.",
    url: "https://bezel.com.br/obras",
    type: "website",
  },
};

type ObraResumo = {
  _id: string;
  titulo?: string | null;
  slug?: { current?: string | null } | null;
  status?: string | null;
  categoria?: { nome?: string | null } | null;
  capa?: object | null;
  capaAlt?: string | null;
  localizacao?: string | null;
  tipoObra?: string | null;
  ano?: number | null;
  area?: number | null;
  metragemConstruida?: number | null;
};

export default async function ObrasPage() {
  const { data } = await sanityFetch({ query: obrasQuery });
  const obras = (data ?? []) as ObraResumo[];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://bezel.com.br/obras#page",
        name: "Obras da BEZEL",
        url: "https://bezel.com.br/obras",
        description:
          "Portfólio de obras de construção, reformas e gerenciamento da BEZEL no Vale do Paraíba.",
        isPartOf: { "@id": "https://bezel.com.br/#website" },
        about: { "@id": "https://bezel.com.br/#organization" },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: obras
            .filter((obra) => obra.slug?.current)
            .map((obra, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: obra.titulo,
              url: `https://bezel.com.br/obras/${obra.slug?.current}`,
            })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: "https://bezel.com.br/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Obras",
            item: "https://bezel.com.br/obras",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schema} />
      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <div className="flex flex-col items-start gap-3 text-left">
            <span className="text-sm font-medium uppercase tracking-widest text-gold-text">
              Execução
            </span>
            <h1 className="font-display text-3xl text-navy sm:text-4xl">
              Nossas Obras
            </h1>
            <p className="max-w-2xl text-base text-foreground/70">
              Do planejamento à entrega, acompanhe algumas das obras que transformamos em realidade.
            </p>
          </div>

          <div className="max-w-4xl space-y-4 text-base leading-8 text-foreground/75">
            <p>
              Cada obra exige decisões próprias. Terreno, projetos, materiais, etapas de execução
              e organização de equipes influenciam a qualidade do resultado. Na BEZEL, trabalhamos
              com construção, reformas e gerenciamento de obras em Jacareí, São José dos Campos
              e outras cidades do Vale do Paraíba, com escopo definido conforme as necessidades
              de cada cliente.
            </p>
            <p>
              Nesta seleção você pode conhecer os empreendimentos publicados, identificar
              características de cada obra e acessar os registros e as soluções técnicas
              disponíveis. As informações e imagens exibidas respeitam o que foi autorizado
              para divulgação.
            </p>
          </div>

          {obras.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {obras.map((obra) => (
                <ObraCard
                  key={obra._id}
                  titulo={obra.titulo ?? ""}
                  slug={obra.slug?.current ?? ""}
                  status={obra.status ?? undefined}
                  categoriaNome={obra.categoria?.nome ?? undefined}
                  capa={obra.capa ?? {}}
                  capaAlt={obra.capaAlt ?? undefined}
                  localizacao={obra.localizacao ?? undefined}
                  tipoObra={obra.tipoObra ?? undefined}
                  ano={obra.ano ?? undefined}
                  area={obra.area ?? undefined}
                  metragemConstruida={obra.metragemConstruida ?? undefined}
                />
              ))}
            </div>
          ) : (
            <p className="text-foreground/60">
              Os registros de obras estão sendo preparados para publicação.
            </p>
          )}
        </Container>
      </section>

      <section className="border-y border-navy/10 bg-[#F8F7F4] py-16 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="text-sm font-medium uppercase tracking-widest text-gold-text">
              Nosso processo
            </span>
            <h2 className="mt-3 font-display text-2xl text-navy sm:text-3xl">
              O que existe por trás de uma obra bem executada?
            </h2>
            <p className="mt-4 leading-8 text-foreground/75">
              Além do resultado visual, uma construção depende de planejamento, decisões
              técnicas e acompanhamento das etapas. De acordo com o serviço contratado,
              a BEZEL pode atuar nas seguintes frentes:
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <span className="text-sm font-semibold text-gold-text">01 · Antes da obra</span>
              <h3 className="mt-3 font-display text-xl text-navy">Análise e planejamento</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/75">
                Avaliação das condições do terreno, entendimento dos projetos, escopo,
                planejamento de materiais, orçamento e sequência das atividades.
              </p>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <span className="text-sm font-semibold text-gold-text">02 · Durante a obra</span>
              <h3 className="mt-3 font-display text-xl text-navy">Execução e acompanhamento</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/75">
                Coordenação de equipes e fornecedores, acompanhamento das etapas,
                atenção à compatibilização de projetos e controle das atividades.
              </p>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-6">
              <span className="text-sm font-semibold text-gold-text">03 · Ao longo do processo</span>
              <h3 className="mt-3 font-display text-xl text-navy">Registros e decisões</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/75">
                Organização de informações da obra para apoiar verificações,
                identificar necessidades de ajuste e manter clareza sobre o andamento.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-5">
          <h2 className="max-w-3xl font-display text-2xl text-navy sm:text-3xl">
            Construção, reformas e sistemas construtivos no Vale do Paraíba
          </h2>
          <p className="max-w-4xl leading-8 text-foreground/75">
            Uma residência nova, uma reforma ou uma ampliação pedem soluções diferentes.
            Além dos métodos convencionais, a BEZEL trabalha com alternativas como
            Steel Frame, Light Steel Frame e BlocoK, conforme a viabilidade técnica
            e as características de cada projeto. A escolha do sistema deve considerar
            desempenho esperado, planejamento, custo global e condições de execução.
          </p>
          <p className="max-w-4xl leading-8 text-foreground/75">
            Quer entender quais serviços se aplicam à sua obra? Conheça nossas{" "}
            <Link href="/servicos" className="font-semibold text-gold-text hover:underline">
              soluções de construção e gerenciamento
            </Link>{" "}
            ou converse com a equipe antes de tomar decisões sobre o projeto.
          </p>
          <div className="pt-3">
            <Button href="/orcamento" variant="primary">
              Conversar sobre minha obra
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
