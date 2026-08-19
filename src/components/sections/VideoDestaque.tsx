// src/components/sections/VideoDestaque.tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { getVideoEmbedInfo } from "@/lib/video";

interface VideoDestaqueProps {
  titulo: string;
  url: string;
  thumbnail?: NonNullable<unknown> | null;
  categoriaNome?: string | null;
  descricaoCurta?: string | null;
  duracao?: string | null;
  onPlay: () => void;
}

export function VideoDestaque({
  titulo,
  url,
  thumbnail,
  categoriaNome,
  descricaoCurta,
  duracao,
  onPlay,
}: VideoDestaqueProps) {
  const info = getVideoEmbedInfo(url);
  if (!info) return null;

  const thumbnailUrl = thumbnail
    ? urlFor(thumbnail).width(1200).height(675).url()
    : info.plataforma === "youtube"
      ? info.thumbnailUrl
      : null;

  return (
    <button
      onClick={onPlay}
      aria-label={`Assistir vídeo em destaque: ${titulo}`}
      className="group grid gap-6 text-left lg:grid-cols-2 lg:items-center"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-navy">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt="" fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy to-navy/70" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-navy/30 transition-colors group-hover:bg-navy/40">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-navy">
            ▶
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-gold-text">
          Destaque{categoriaNome ? ` · ${categoriaNome}` : ""}
        </span>
        <h3 className="font-display text-2xl text-navy">{titulo}</h3>
        {descricaoCurta && (
          <p className="text-foreground/70">{descricaoCurta}</p>
        )}
        {duracao && (
          <span className="text-sm text-foreground/50">{duracao}</span>
        )}
        <span className="mt-2 text-sm font-medium text-gold-text group-hover:underline">
          Assistir vídeo →
        </span>
      </div>
    </button>
  );
}