"use client";

import dynamic from "next/dynamic";

export const PortfolioCarouselClient = dynamic(
  () =>
    import("@/components/sections/PortfolioCarouselClient").then(
      (mod) => mod.PortfolioCarouselClient
    ),
  { ssr: false }
);