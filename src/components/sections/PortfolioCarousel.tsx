import { sanityFetch } from "@/sanity/lib/live";
import { projetosDestaqueQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PortfolioCarouselClient } from "@/components/sections/PortfolioCarouselDynamic";

export async function PortfolioCarousel() {
  const { data: projetos } = await sanityFetch({
    query: projetosDestaqueQuery,
  });

  if (!projetos || projetos.length === 0) return null;

  return (
    <section className="bg-navy/[0.03] py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="Portfólio"
          title="Projetos em Destaque"
          description="Uma seleção dos nossos trabalhos mais recentes, em diferentes segmentos."
        />
        <PortfolioCarouselClient projetos={projetos} />
      </Container>
    </section>
  );
}