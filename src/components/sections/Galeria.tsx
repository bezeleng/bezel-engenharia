// src/components/sections/Galeria.tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface GaleriaProps {
  imagens?: NonNullable<unknown>[];
}

export function Galeria({ imagens }: GaleriaProps) {
  if (!imagens || imagens.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {imagens.map((imagem, index) => (
        <div
          key={index}
          className="relative aspect-[4/3] overflow-hidden rounded-lg"
        >
          <Image
            src={urlFor(imagem).width(600).height(450).url()}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}