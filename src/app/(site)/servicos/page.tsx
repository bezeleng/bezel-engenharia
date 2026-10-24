import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { servicosQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServicoCard } from "@/components/sections/ServicoCard";

export const metadata: Metadata = {
  title: "Serviços de Construção no Vale do Paraíba",
  description:
    "Projetos, planejamento, execução e gerenciamento de obras no Vale do Paraíba, incluindo Steel Frame, Light Steel Frame e BlocoK.",
  alternates: {
    canonical: "/servicos",
  },
  openGraph: {
    title: "Serviços de Construção no Vale do Paraíba | BEZEL",
    description:
      "Soluções da BEZEL para projetar, construir e gerenciar obras em Jacareí, São José dos Campos e todo o Vale do Paraíba.",
    url: "https://bezel.com.br/servicos",
    type: "website",
  },
};

export default async function ServicosPage() {
  const { data: servicos } = await sanityFetch({ query: servicosQuery });

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="O que fazemos"
          title="Nossos Serviços"
          description="Soluções completas para construir, reformar e gerenciar sua obra, do planejamento à entrega."
        />
        {servicos && servicos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicos.map((servico) => (
              <ServicoCard
                key={servico._id}
                titulo={servico.titulo ?? ""}
                slug={servico.slug?.current ?? ""}
                descricaoCurta={servico.descricaoCurta ?? ""}
                icone={servico.icone}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Nenhum serviço cadastrado ainda.</p>
        )}
      </Container>
    </section>
  );
}