import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { obrasQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ObraCard } from "@/components/sections/ObraCard";

export const metadata: Metadata = {
  title: "Obras",
  description: "Acompanhe as obras executadas e em andamento pela BEZEL.",
  alternates: {
    canonical: "/obras",
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
          description="Construções que já saíram do papel, com nosso acompanhamento técnico."
        />
        {obras && obras.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra) => (
              <ObraCard
                key={obra._id}
                titulo={obra.titulo}
                slug={obra.slug?.current ?? ""}
                status={obra.status}
                categoriaNome={obra.categoria?.nome}
                capa={obra.capa}
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