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
  capaAlt?: string;
  localizacao?: string;
  tipoObra?: string;
  ano?: number;
  area?: number;
  metragemConstruida?: number;
}

const statusLabel: Record<string, string> = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
  registro_fotografico: "Registro fotográfico",
};

const tipoObraLabel: Record<string, string> = {
  construcao_nova: "Construção nova",
  reforma: "Reforma",
  ampliacao: "Ampliação",
  retrofit: "Retrofit",
};

export function ObraCard({
  titulo,
  slug,
  status,
  categoriaNome,
  capa,
  capaAlt,
  localizacao,
  tipoObra,
  ano,
  area,
  metragemConstruida,
}: ObraCardProps) {
  const imagemUrl = urlFor(capa).width(600).height(400).url();
  const metragem = metragemConstruida ?? area;
  const metragemRotulo = metragemConstruida ? "Área construída" : "Área";
  const detalhes = [
    localizacao,
    tipoObra ? tipoObraLabel[tipoObra] ?? tipoObra : null,
    typeof metragem === "number" && metragem > 0
      ? `${metragemRotulo}: ${metragem.toLocaleString("pt-BR")} m²`
      : null,
    typeof ano === "number" && ano > 1900 ? String(ano) : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <Link href={`/obras/${slug}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
        <Image
          src={imagemUrl}
          alt={capaAlt || titulo}
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
        {detalhes.length > 0 && (
          <p className="mt-2 text-sm leading-6 text-foreground/65">
            {detalhes.join(" · ")}
          </p>
        )}
        <span className="mt-3 inline-block text-sm font-semibold text-gold-text group-hover:underline">
          Conhecer a obra
        </span>
      </div>
    </Link>
  );
}
