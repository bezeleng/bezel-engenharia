import { Hero } from "@/components/sections/Hero";
import { ServicosGrid } from "@/components/sections/ServicosGrid";
import { SecaoGestao } from "@/components/sections/SecaoGestao";
import { PortfolioCarousel } from "@/components/sections/PortfolioCarousel";
import { DepoimentosDestaque } from "@/components/sections/DepoimentosDestaque";
import { CtaFinal } from "@/components/sections/CtaFinal";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicosGrid />
      <SecaoGestao />
      <PortfolioCarousel />
      <DepoimentosDestaque />
      <CtaFinal />
    </>
  );
}