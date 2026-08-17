// src/components/sections/ObraCard.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface ObraCardProps {
  titulo: string;
  slug: string;
  status?: string;
  categoriaNome?: string;
  capa: NonNullable<unknown>;
}

const statusLabel: Record<string, string> = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

export function ObraCard({
  titulo,
  slug,
  status,
  categoriaNome,
  capa,
}: ObraCardProps) {
  const imagemUrl = urlFor(capa).width(600).height(400).url();

  return (
    <Link href={`/obras/${slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
        <Image
          src={imagemUrl}
          alt={titulo}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {status && (
          <span className="absolute top-3 left-3 rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
            {statusLabel[status] ?? status}
          </span>
        )}
      </div>
      <div className="mt-4">
        {categoriaNome && (
          <span className="text-xs font-medium uppercase tracking-widest text-gold-text">
            {categoriaNome}
          </span>
        )}
        <h3 className="font-display mt-1 text-lg text-navy">{titulo}</h3>
      </div>
    </Link>
  );
}