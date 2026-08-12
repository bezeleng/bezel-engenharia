// src/app/(site)/page.tsx
import { Hero } from "@/components/sections/Hero";
import { ServicosGrid } from "@/components/sections/ServicosGrid";
import { PortfolioCarousel } from "@/components/sections/PortfolioCarousel";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicosGrid />
      <PortfolioCarousel />
    </>
  );
}