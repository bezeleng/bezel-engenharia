import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { projetosQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProjetoCard } from "@/components/sections/ProjetoCard";

export const metadata: Metadata = {
  title: "Projetos de Arquitetura e Engenharia no Vale do Paraíba",
  description:
    "Portfólio de projetos de arquitetura e engenharia da BEZEL para Jacareí, São José dos Campos e demais cidades do Vale do Paraíba.",
  alternates: {
    canonical: "/projetos",
  },
  openGraph: {
    title: "Projetos de Arquitetura e Engenharia | BEZEL",
    description:
      "Conheça projetos desenvolvidos pela BEZEL no Vale do Paraíba, unindo técnica, funcionalidade e viabilidade de execução.",
    url: "https://bezel.com.br/projetos",
    type: "website",
  },
};

export default async function ProjetosPage() {
  const { data: projetos } = await sanityFetch({ query: projetosQuery });

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="Portfólio"
          title="Nossos Projetos"
          description="Projetos desenvolvidos para diferentes necessidades, com soluções que unem arquitetura, técnica, funcionalidade e viabilidade de execução."
        />
        {projetos && projetos.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projetos.map((projeto) => (
              <ProjetoCard
                key={projeto._id}
                titulo={projeto.titulo ?? ""}
                slug={projeto.slug?.current ?? ""}
                categoriaNome={projeto.categoria?.nome ?? undefined}
                capa={projeto.capa ?? {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Nenhum projeto cadastrado ainda.</p>
        )}
      </Container>
    </section>
  );
}