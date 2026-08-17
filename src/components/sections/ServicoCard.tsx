// src/components/sections/ServicoCard.tsx
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface ServicoCardProps {
  titulo: string;
  slug: string;
  descricaoCurta: string;
  icone?: NonNullable<unknown> | null;
}

export function ServicoCard({
  titulo,
  slug,
  descricaoCurta,
  icone,
}: ServicoCardProps) {
  const iconeUrl = icone ? urlFor(icone).width(64).height(64).url() : null;

  return (
    <Link
      href={`/servicos/${slug}`}
      className="group flex flex-col gap-4 rounded-lg border border-navy/10 p-6 transition-colors hover:border-gold"
    >
      {iconeUrl && (
        <Image src={iconeUrl} alt="" width={48} height={48} />
      )}
      <h3 className="font-display text-xl text-navy">{titulo}</h3>
      <p className="text-sm text-foreground/70">{descricaoCurta}</p>
      <span className="text-sm font-medium text-gold-text group-hover:underline">
        Saiba mais →
      </span>
    </Link>
  );
}