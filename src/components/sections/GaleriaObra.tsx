// src/components/sections/GaleriaObra.tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface ItemGaleria {
  imagem?: NonNullable<unknown> | null;
  legenda?: string | null;
  etapa?: string | null;
  ordem?: number | null;
}

interface GaleriaObraProps {
  itens?: ItemGaleria[] | null;
}

const etapaLabel: Record<string, string> = {
  antes: "Antes",
  durante: "Durante",
  depois: "Depois",
};

export function GaleriaObra({ itens }: GaleriaObraProps) {
  if (!itens || itens.length === 0) return null;

  const ordenados = [...itens].sort((a, b) => {
    const ordemA = a.ordem ?? Number.MAX_SAFE_INTEGER;
    const ordemB = b.ordem ?? Number.MAX_SAFE_INTEGER;
    return ordemA - ordemB;
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ordenados.map((item, index) => {
        if (!item.imagem) return null;
        const imagemUrl = urlFor(item.imagem).width(600).height(450).url();

        return (
          <figure
            key={index}
            className="relative overflow-hidden rounded-lg"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={imagemUrl}
                alt={item.legenda ?? ""}
                fill
                className="object-cover"
              />
              {item.etapa && (
                <span className="absolute top-3 left-3 rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
                  {etapaLabel[item.etapa] ?? item.etapa}
                </span>
              )}
            </div>
            {item.legenda && (
              <figcaption className="mt-2 text-sm text-foreground/60">
                {item.legenda}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}