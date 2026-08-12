"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ProjetoCard } from "@/components/sections/ProjetoCard";

interface Projeto {
  _id: string;
  titulo: string;
  slug: { current: string };
  capa: NonNullable<unknown>;
  categoria?: { nome: string };
}

interface PortfolioCarouselClientProps {
  projetos: Projeto[];
}

export function PortfolioCarouselClient({
  projetos,
}: PortfolioCarouselClientProps) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={24}
      slidesPerView={1}
      observer
      observeParents
      className="w-full"
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {projetos.map((projeto) => (
        <SwiperSlide key={projeto._id}>
          <ProjetoCard
            titulo={projeto.titulo}
            slug={projeto.slug.current}
            categoriaNome={projeto.categoria?.nome}
            capa={projeto.capa}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}