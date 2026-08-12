// src/app/(site)/projetos/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  projetoBySlugQuery,
  projetoSlugsQuery,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { FichaTecnica } from "@/components/sections/FichaTecnica";
import { Galeria } from "@/components/sections/Galeria";

export async function generateStaticParams() {
  const slugs = await client.fetch(projetoSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

interface ProjetoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjetoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: projeto } = await sanityFetch({
    query: projetoBySlugQuery,
    params: { slug },
  });

  if (!projeto) return {};

  return {
    title: projeto.seo?.metaTitulo || `${projeto.titulo} | BEZEL Engenharia`,
    description: projeto.seo?.metaDescricao,
  };
}

export default async function ProjetoPage({ params }: ProjetoPageProps) {
  const { slug } = await params;
  const { data: projeto } = await sanityFetch({
    query: projetoBySlugQuery,
    params: { slug },
  });

  if (!projeto) notFound();

  const capaUrl = urlFor(projeto.capa).width(1600).height(900).url();

  return (
    <>
      <section className="py-16">
        <Container className="flex flex-col gap-8">
          <div>
            {projeto.categoria?.nome && (
              <span className="text-sm font-medium uppercase tracking-widest text-gold">
                {projeto.categoria.nome}
              </span>
            )}
            <h1 className="font-display mt-2 text-3xl text-navy sm:text-4xl">
              {projeto.titulo}
            </h1>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={capaUrl}
              alt={projeto.titulo}
              fill
              className="object-cover"
            />
          </div>
          <FichaTecnica
            cliente={projeto.cliente}
            area={projeto.area}
            ano={projeto.ano}
            localizacao={projeto.localizacao}
          />
          {projeto.descricao && (
            <div className="max-w-3xl">
              <PortableTextContent value={projeto.descricao} />
            </div>
          )}
          <Galeria imagens={projeto.galeria} />
        </Container>
      </section>
    </>
  );
}