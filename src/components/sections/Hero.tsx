// src/components/sections/Hero.tsx
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { paginaInicialQuery } from "@/sanity/lib/queries";
import { HeroContent } from "@/components/sections/HeroContent";
import { Container } from "@/components/ui/Container";

export async function Hero() {
  const { data: paginaInicial } = await sanityFetch({
    query: paginaInicialQuery,
  });

  if (!paginaInicial) return null;

  const imagemUrl = paginaInicial.imagemFundo
    ? urlFor(paginaInicial.imagemFundo).width(1920).height(1080).url()
    : null;

  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden bg-navy">
      {imagemUrl && (
        <Image
          src={imagemUrl}
          alt=""
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-navy/60" />
      <Container className="relative z-10 py-24">
        <HeroContent
          titulo={paginaInicial.tituloHero}
          subtitulo={paginaInicial.subtituloHero}
          textoCta={paginaInicial.textoCta}
          linkCta={paginaInicial.linkCta}
        />
      </Container>
    </section>
  );
}