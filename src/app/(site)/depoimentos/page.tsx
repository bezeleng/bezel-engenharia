// src/app/(site)/depoimentos/page.tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { depoimentosQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { DepoimentoCard } from "@/components/sections/DepoimentoCard";

export const metadata: Metadata = {
  title: "Depoimentos",
  description:
    "Cada obra envolve decisões importantes. Conheça a experiência de clientes que confiaram à BEZEL o planejamento, gerenciamento e execução de seus projetos.",
  alternates: {
    canonical: "/depoimentos",
  },
};

export default async function DepoimentosPage() {
  const { data: depoimentos } = await sanityFetch({ query: depoimentosQuery });

  return (
    <>
      <section className="py-20">
        <Container className="flex flex-col gap-12">
          <SectionTitle
            eyebrow="Experiências reais"
            title="A confiança de quem construiu conosco"
            description="Cada obra envolve decisões importantes. Conheça a experiência de clientes que confiaram à BEZEL o planejamento, gerenciamento e execução de seus projetos."
          />
          {depoimentos && depoimentos.length > 0 ? (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {depoimentos.map((depoimento) => (
                <DepoimentoCard
                  key={depoimento._id}
                  nomeCliente={depoimento.nomeCliente ?? ""}
                  cargoEmpresa={depoimento.cargoEmpresa}
                  foto={depoimento.foto}
                  texto={depoimento.texto ?? ""}
                  nota={depoimento.nota}
                  servicoNome={depoimento.tipoServico?.nome}
                  obraTitulo={depoimento.obraRelacionada?.titulo}
                  obraSlug={depoimento.obraRelacionada?.slug}
                />
              ))}
            </div>
          ) : (
            <p className="text-foreground/60">
              Nenhum depoimento cadastrado ainda.
            </p>
          )}
        </Container>
      </section>

      <section className="bg-navy py-16">
        <Container className="flex flex-col items-center gap-4 text-center text-white">
          <h2 className="font-display text-2xl sm:text-3xl">
            Seu projeto também pode começar com uma boa experiência.
          </h2>
          <p className="max-w-lg text-white/80">
            Converse com nossa equipe e descubra como podemos planejar sua
            obra com mais controle, organização e segurança.
          </p>
          <Button href="/orcamento" variant="primary">
            Solicitar Orçamento
          </Button>
        </Container>
      </section>
    </>
  );
}