// src/components/sections/ProjetoCard.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface ProjetoCardProps {
  titulo: string;
  slug: string;
  categoriaNome?: string;
  capa: NonNullable<unknown>;
}

export function ProjetoCard({
  titulo,
  slug,
  categoriaNome,
  capa,
}: ProjetoCardProps) {
  const imagemUrl = urlFor(capa).width(600).height(400).url();

  return (
    <Link href={`/projetos/${slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
        <Image
  src={imagemUrl}
  alt={titulo}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover transition-transform duration-500 group-hover:scale-105"
/>
      </div>
      <div className="mt-4">
        {categoriaNome && (
          <span className="text-xs font-medium uppercase tracking-widest text-gold">
            {categoriaNome}
          </span>
        )}
        <h3 className="font-display mt-1 text-lg text-navy">{titulo}</h3>
      </div>
    </Link>
  );
}   