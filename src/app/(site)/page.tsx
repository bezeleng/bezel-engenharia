import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ServicosGrid } from "@/components/sections/ServicosGrid";
import { GaleriaDestaquesHome } from "@/components/sections/GaleriaDestaquesHome";
import { SecaoGestao } from "@/components/sections/SecaoGestao";
import { PortfolioCarousel } from "@/components/sections/PortfolioCarousel";
import { DepoimentosDestaque } from "@/components/sections/DepoimentosDestaque";
import { CtaFinal } from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "Construtora no Vale do Paraíba",
  description:
    "Construtora em Jacareí com atuação em todo o Vale do Paraíba. Projetos, execução, gerenciamento de obras, Steel Frame e BlocoK.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Construtora no Vale do Paraíba | BEZEL",
    description:
      "Projetos, construção e gerenciamento de obras no Vale do Paraíba, com soluções em Steel Frame, Light Steel Frame e BlocoK.",
    url: "https://bezel.com.br/",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ServicosGrid />
      <GaleriaDestaquesHome />
      <SecaoGestao />
      <PortfolioCarousel />
      <DepoimentosDestaque />
      <CtaFinal />
    </>
  );
}