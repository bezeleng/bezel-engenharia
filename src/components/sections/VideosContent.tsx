// src/components/sections/VideosContent.tsx
"use client";

import { useMemo, useState } from "react";
import { VideoCard } from "@/components/sections/VideoCard";
import { VideoDestaque } from "@/components/sections/VideoDestaque";
import { VideoFiltro } from "@/components/sections/VideoFiltro";
import { VideoModal } from "@/components/sections/VideoModal";

interface Categoria {
  _id: string;
  nome?: string | null;
}

interface Video {
  _id: string;
  titulo?: string | null;
  url?: string | null;
  thumbnail?: NonNullable<unknown> | null;
  descricaoCurta?: string | null;
  descricaoCompleta?: NonNullable<unknown> | null;
  duracao?: string | null;
  destaque?: boolean | null;
  categoria?: { _id: string; nome?: string | null } | null;
}

interface VideosContentProps {
  videos: Video[];
  categoriasComVideo: Categoria[];
}

export function VideosContent({
  videos,
  categoriasComVideo,
}: VideosContentProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [videoAberto, setVideoAberto] = useState<Video | null>(null);

  const videoDestaque = useMemo(
    () => videos.find((video) => video.destaque),
    [videos]
  );

  const videosGrade = useMemo(() => {
    const semDestaque = videos.filter((video) => video._id !== videoDestaque?._id);
    if (!categoriaAtiva) return semDestaque;
    return semDestaque.filter(
      (video) => video.categoria?._id === categoriaAtiva
    );
  }, [videos, videoDestaque, categoriaAtiva]);

  const mostrarFiltros = categoriasComVideo.length > 1;

  return (
    <div className="flex flex-col gap-12">
      {videoDestaque && videoDestaque.titulo && videoDestaque.url && (
                <VideoDestaque
          titulo={videoDestaque.titulo}
          url={videoDestaque.url}
          thumbnail={videoDestaque.thumbnail}
          categoriaNome={videoDestaque.categoria?.nome}
          descricaoCurta={videoDestaque.descricaoCurta}
          duracao={videoDestaque.duracao}
          onPlay={() => setVideoAberto(videoDestaque)}
        />
      )}

      {mostrarFiltros && (
        <VideoFiltro
          categorias={categoriasComVideo}
          categoriaAtiva={categoriaAtiva}
          onSelect={setCategoriaAtiva}
        />
      )}

      {videosGrade.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videosGrade.map((video) =>
            video.titulo && video.url ? (
              <VideoCard
                key={video._id}
                titulo={video.titulo}
                url={video.url}
                thumbnail={video.thumbnail}
                categoriaNome={video.categoria?.nome}
                descricaoCurta={video.descricaoCurta}
                duracao={video.duracao}
                onPlay={() => setVideoAberto(video)}
              />
            ) : null
          )}
        </div>
      ) : categoriaAtiva ? (
  <p className="text-foreground/60">
    Nenhum vídeo encontrado nessa categoria.
  </p>
) : videoDestaque ? null : (
  <p className="text-foreground/60">Nenhum vídeo cadastrado ainda.</p>
)}

            {videoAberto && videoAberto.titulo && videoAberto.url && (
        <VideoModal
          titulo={videoAberto.titulo}
          url={videoAberto.url}
          descricaoCompleta={videoAberto.descricaoCompleta}
          onClose={() => setVideoAberto(null)}
        />
      )}
    </div>
  );
}