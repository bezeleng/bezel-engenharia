import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { obrasQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ObraCard } from "@/components/sections/ObraCard";

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

export default async function ObrasPage() {
  const { data: obras } = await sanityFetch({ query: obrasQuery });

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="Execução"
          title="Nossas Obras"
          description="Do planejamento à entrega, acompanhe algumas das obras que transformamos em realidade."
        />
        {obras && obras.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra) => (
              <ObraCard
                key={obra._id}
                titulo={obra.titulo ?? ""}
                slug={obra.slug?.current ?? ""}
                status={obra.status ?? undefined}
                categoriaNome={obra.categoria?.nome ?? undefined}
                capa={obra.capa ?? {}}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Nenhuma obra cadastrada ainda.</p>
        )}
      </Container>
    </section>
  );
}