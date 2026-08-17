import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { obraBySlugQuery, obraSlugsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { FichaTecnica } from "@/components/sections/FichaTecnica";
import { Galeria } from "@/components/sections/Galeria";

export async function generateStaticParams() {
  const slugs = await client.fetch(obraSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

interface ObraPageProps {
  params: Promise<{ slug: string }>;
}

const statusLabel: Record<string, string> = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

export async function generateMetadata({
  params,
}: ObraPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: obra } = await sanityFetch({
    query: obraBySlugQuery,
    params: { slug },
  });

  if (!obra) return {};

  return {
    title: obra.seo?.metaTitulo || obra.titulo,
    description: obra.seo?.metaDescricao,
    alternates: {
      canonical: `/obras/${slug}`,
    },
  };
}

export default async function ObraPage({ params }: ObraPageProps) {
  const { slug } = await params;
  const { data: obra } = await sanityFetch({
    query: obraBySlugQuery,
    params: { slug },
  });

  if (!obra) notFound();

  const capaUrl = obra.capa
  ? urlFor(obra.capa).width(1600).height(900).url()
  : null;

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-3">
          {obra.categoria?.nome && (
            <span className="text-sm font-medium uppercase tracking-widest text-gold">
              {obra.categoria.nome}
            </span>
          )}
          {obra.status && (
            <span className="rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
              {statusLabel[obra.status] ?? obra.status}
            </span>
          )}
        </div>
        <h1 className="font-display -mt-4 text-3xl text-navy sm:text-4xl">
          {obra.titulo}
        </h1>
        {capaUrl && (
  <div className="relative aspect-video overflow-hidden rounded-lg">
    <Image
      src={capaUrl}
      alt={obra.titulo ?? ""}
      fill
      className="object-cover"
    />
  </div>
)}
        <FichaTecnica
          cliente={obra.cliente}
          area={obra.area}
          ano={obra.ano}
          localizacao={obra.localizacao}
        />
        {obra.descricao && (
          <div className="max-w-3xl">
            <PortableTextContent value={obra.descricao} />
          </div>
        )}
        <Galeria imagens={obra.galeria} />
      </Container>
    </section>
  );
}