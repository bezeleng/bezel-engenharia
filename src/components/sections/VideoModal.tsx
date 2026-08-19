// src/components/sections/VideoModal.tsx
"use client";

import { useEffect, useRef } from "react";
import { getVideoEmbedInfo, plataformaLabel } from "@/lib/video";
import { PortableTextContent } from "@/components/ui/PortableTextContent";

interface VideoModalProps {
  titulo: string;
  url: string;
  descricaoCompleta?: NonNullable<unknown> | null;
  onClose: () => void;
}

export function VideoModal({
  titulo,
  url,
  descricaoCompleta,
  onClose,
}: VideoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const info = getVideoEmbedInfo(url);

  useEffect(() => {
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!info) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Fechar vídeo"
          className="absolute -top-10 right-0 text-sm font-medium text-white hover:text-gold"
        >
          Fechar ✕
        </button>
        <div className="aspect-video overflow-hidden rounded-lg bg-black">
          <iframe
            src={info.embedUrl}
            title={titulo}
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <a
          href={info.urlOriginal}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-white/70 hover:text-gold"
        >
          {plataformaLabel[info.plataforma]} &rarr;
        </a>
                {descricaoCompleta && (
          <div className="mt-4 max-h-40 overflow-y-auto rounded-lg bg-black/30 p-4 [&_*]:!text-white/90">
            <PortableTextContent value={descricaoCompleta} />
          </div>
        )}
      </div>
    </div>
  );
}