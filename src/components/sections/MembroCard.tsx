// src/components/sections/MembroCard.tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface MembroCardProps {
  nome: string;
  cargo: string;
  foto?: NonNullable<unknown> | null;
}

export function MembroCard({ nome, cargo, foto }: MembroCardProps) {
  const fotoUrl = foto ? urlFor(foto).width(400).height(400).url() : null;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="relative h-32 w-32 overflow-hidden rounded-full bg-navy/10">
        {fotoUrl && (
          <Image src={fotoUrl} alt={nome} fill className="object-cover" />
        )}
      </div>
      <div>
        <h3 className="font-display text-lg text-navy">{nome}</h3>
        <p className="text-sm text-foreground/60">{cargo}</p>
      </div>
    </div>
  );
}