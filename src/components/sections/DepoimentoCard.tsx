// src/components/sections/DepoimentoCard.tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Rating } from "@/components/ui/Rating";

interface DepoimentoCardProps {
  nomeCliente: string;
  cargoEmpresa?: string;
  foto?: NonNullable<unknown> | null;
  texto: string;
  nota?: number;
}

export function DepoimentoCard({
  nomeCliente,
  cargoEmpresa,
  foto,
  texto,
  nota,
}: DepoimentoCardProps) {
  const fotoUrl = foto ? urlFor(foto).width(120).height(120).url() : null;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-navy/10 p-6">
      {nota && <Rating nota={nota} />}
      <p className="text-foreground/80">&ldquo;{texto}&rdquo;</p>
      <div className="mt-auto flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-navy/10">
          {fotoUrl && (
            <Image src={fotoUrl} alt={nomeCliente} fill className="object-cover" />
          )}
        </div>
        <div>
          <p className="font-medium text-navy">{nomeCliente}</p>
          {cargoEmpresa && (
            <p className="text-sm text-foreground/60">{cargoEmpresa}</p>
          )}
        </div>
      </div>
    </div>
  );
}