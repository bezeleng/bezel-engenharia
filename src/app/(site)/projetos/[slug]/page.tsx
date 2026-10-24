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
import { JsonLd } from "@/components/seo/JsonLd";

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

  const title = projeto.seo?.metaTitulo || projeto.titulo;
  const description =
    projeto.seo?.metaDescricao ||
    [projeto.titulo, projeto.categoria?.nome, projeto.localizacao]
      .filter(Boolean)
      .join(" — ") ||
    "Projeto de arquitetura e engenharia desenvolvido pela BEZEL no Vale do Paraíba.";

  const imagem = projeto.seo?.imagemOg || projeto.capa;
  const imageUrl = imagem
    ? urlFor(imagem).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/projetos/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://bezel.com.br/projetos/${slug}`,
      type: "website",
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
  };
}

export default async function ProjetoPage({ params }: ProjetoPageProps) {
  const { slug } = await params;
  const { data: projeto } = await sanityFetch({
    query: projetoBySlugQuery,
    params: { slug },
  });

  if (!projeto) notFound();

  const capaUrl = projeto.capa
    ? urlFor(projeto.capa).width(1600).height(900).url()
    : null;

  const pageUrl = `https://bezel.com.br/projetos/${slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://bezel.com.br/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projetos",
        item: "https://bezel.com.br/projetos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: projeto.titulo,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
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
          {capaUrl && (
  <div className="relative aspect-video overflow-hidden rounded-lg">
    <Image
      src={capaUrl}
      alt={projeto.titulo ?? ""}
      fill
      className="object-cover"
    />
  </div>
)}
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