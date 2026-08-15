// src/app/(site)/servicos/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  servicoBySlugQuery,
  servicoSlugsQuery,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { Container } from "@/components/ui/Container";
import { PortableTextContent } from "@/components/ui/PortableTextContent";

export async function generateStaticParams() {
  const slugs = await client.fetch(servicoSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

interface ServicoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServicoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: servico } = await sanityFetch({
    query: servicoBySlugQuery,
    params: { slug },
  });

  if (!servico) return {};

  return {
    title: servico.seo?.metaTitulo || servico.titulo,
    description: servico.seo?.metaDescricao || servico.descricaoCurta,
    alternates: {
      canonical: `/servicos/${slug}`,
    },
  };
}

export default async function ServicoPage({ params }: ServicoPageProps) {
  const { slug } = await params;
  const { data: servico } = await sanityFetch({
    query: servicoBySlugQuery,
    params: { slug },
  });

  if (!servico) notFound();

  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">
          {servico.titulo}
        </h1>
        {servico.descricaoLonga && (
          <div className="mt-8">
            <PortableTextContent value={servico.descricaoLonga} />
          </div>
        )}
      </Container>
    </section>
  );
}