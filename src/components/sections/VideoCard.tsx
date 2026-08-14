// src/components/sections/VideoCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { getVideoEmbedInfo } from "@/lib/video";

interface VideoCardProps {
  titulo: string;
  url: string;
  thumbnail?: NonNullable<unknown> | null;
}

export function VideoCard({ titulo, url, thumbnail }: VideoCardProps) {
  const [tocando, setTocando] = useState(false);
  const info = getVideoEmbedInfo(url);

  if (!info) return null;

  const thumbnailUrl = thumbnail
    ? urlFor(thumbnail).width(600).height(340).url()
    : info.thumbnailUrl;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-navy">
        {tocando ? (
          <iframe
            src={info.embedUrl}
            title={titulo}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <button
            onClick={() => setTocando(true)}
            aria-label={`Reproduzir vídeo: ${titulo}`}
            className="group relative h-full w-full"
          >
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt=""
                fill
                className="object-cover"
              />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-navy/30 transition-colors group-hover:bg-navy/40">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-navy">
                ▶
              </span>
            </span>
          </button>
        )}
      </div>
      <h3 className="font-display text-lg text-navy">{titulo}</h3>
    </div>
  );
}