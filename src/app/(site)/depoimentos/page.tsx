// src/app/(site)/depoimentos/page.tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { depoimentosQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DepoimentoCard } from "@/components/sections/DepoimentoCard";

export const metadata: Metadata = {
  title: "Depoimentos | BEZEL Engenharia",
  description: "Veja o que nossos clientes dizem sobre a BEZEL.",
};

export default async function DepoimentosPage() {
  const { data: depoimentos } = await sanityFetch({ query: depoimentosQuery });

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="Clientes"
          title="Depoimentos"
          description="A satisfação de quem já confiou seus projetos à BEZEL."
        />
        {depoimentos && depoimentos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {depoimentos.map((depoimento) => (
              <DepoimentoCard
                key={depoimento._id}
                nomeCliente={depoimento.nomeCliente}
                cargoEmpresa={depoimento.cargoEmpresa}
                foto={depoimento.foto}
                texto={depoimento.texto}
                nota={depoimento.nota}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Nenhum depoimento cadastrado ainda.</p>
        )}
      </Container>
    </section>
  );
}