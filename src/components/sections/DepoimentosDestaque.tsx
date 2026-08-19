// src/components/sections/DepoimentosDestaque.tsx
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { depoimentosDestaqueQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DepoimentoCard } from "@/components/sections/DepoimentoCard";

export async function DepoimentosDestaque() {
  const { data: depoimentos } = await sanityFetch({
    query: depoimentosDestaqueQuery,
  });

  if (!depoimentos || depoimentos.length === 0) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-10">
        <SectionTitle
          eyebrow="Experiências reais"
          title="O que nossos clientes dizem"
          description="A confiança construída em cada projeto."
        />
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
        <Link
          href="/depoimentos"
          className="mx-auto text-sm font-medium text-gold-text hover:underline"
        >
          Ver todos os depoimentos →
        </Link>
      </Container>
    </section>
  );
}