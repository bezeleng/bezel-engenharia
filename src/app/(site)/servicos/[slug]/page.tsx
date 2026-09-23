// src/app/(site)/servicos/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import {
  servicoBySlugQuery,
  servicoSlugsQuery,
} from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
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

  const imagemDestaqueUrl = servico.imagemDestaque
    ? urlFor(servico.imagemDestaque).width(1400).height(800).fit("crop").url()
    : null;

  return (
    <section className="py-20">
      <Container className="max-w-5xl">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">
          {servico.titulo}
        </h1>

        {servico.descricaoLonga && (
          <div className="mt-8 max-w-3xl">
            <PortableTextContent value={servico.descricaoLonga} />
          </div>
        )}

        {imagemDestaqueUrl && (
          <div className="relative mt-10 aspect-[16/9] max-w-3xl overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={imagemDestaqueUrl}
              alt={servico.titulo ?? ""}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {servico.galeria && servico.galeria.length > 0 && (
          <div className="mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
            {servico.galeria.map((imagem) => {
              const imagemUrl = urlFor(imagem)
                .width(1000)
                .height(700)
                .fit("crop")
                .url();

              return (
                <figure key={imagem._key} className="overflow-hidden rounded-2xl">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={imagemUrl}
                      alt={imagem.legenda ?? servico.titulo ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {imagem.legenda && (
                    <figcaption className="mt-2 text-sm text-foreground/60">
                      {imagem.legenda}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}