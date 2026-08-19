// src/components/sections/DepoimentoCard.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Rating } from "@/components/ui/Rating";

interface DepoimentoCardProps {
  nomeCliente: string;
  cargoEmpresa?: string | null;
  foto?: NonNullable<unknown> | null;
  texto: string;
  nota?: number | null;
  servicoNome?: string | null;
  obraTitulo?: string | null;
  obraSlug?: string | null;
}

export function DepoimentoCard({
  nomeCliente,
  cargoEmpresa,
  foto,
  texto,
  nota,
  servicoNome,
  obraTitulo,
  obraSlug,
}: DepoimentoCardProps) {
  const fotoUrl = foto ? urlFor(foto).width(120).height(120).url() : null;
  const iniciais = nomeCliente
    .split(" ")
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-navy/10 p-6">
      {nota && <Rating nota={nota} />}
      <p className="text-foreground/80">&ldquo;{texto}&rdquo;</p>

      {servicoNome && (
        <span className="text-xs font-medium uppercase tracking-widest text-gold-text">
          {servicoNome}
        </span>
      )}

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy/10">
            {fotoUrl ? (
              <Image
                src={fotoUrl}
                alt={nomeCliente}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-navy">
                {iniciais}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-navy">{nomeCliente}</p>
            {cargoEmpresa && (
              <p className="text-sm text-foreground/60">{cargoEmpresa}</p>
            )}
          </div>
        </div>

        {obraTitulo && obraSlug && (
          <Link
            href={`/obras/${obraSlug}`}
            className="text-sm font-medium text-gold-text hover:underline"
          >
            Conheça esta obra →
          </Link>
        )}
      </div>
    </div>
  );
}