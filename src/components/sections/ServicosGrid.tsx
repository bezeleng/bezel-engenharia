// src/components/sections/ServicosGrid.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { servicosQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServicoCard } from "@/components/sections/ServicoCard";

export async function ServicosGrid() {
  const { data: servicos } = await sanityFetch({ query: servicosQuery });

  if (!servicos || servicos.length === 0) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="O que fazemos"
          title="Nossos Serviços"
          description="Soluções completas em arquitetura, engenharia e construção, do projeto à entrega."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico) => (
            <ServicoCard
              key={servico._id}
              titulo={servico.titulo}
              slug={servico.slug?.current ?? ""}
              descricaoCurta={servico.descricaoCurta ?? ""}
              icone={servico.icone}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}