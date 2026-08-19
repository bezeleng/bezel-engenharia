// src/components/sections/AvaliacoesGoogle.tsx
import { Button } from "@/components/ui/Button";

interface AvaliacoesGoogleProps {
  link?: string | null;
}

export function AvaliacoesGoogle({ link }: AvaliacoesGoogleProps) {
  if (!link) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gold/30 p-6">
      <h3 className="font-display text-lg text-navy">
        Veja o que nossos clientes dizem
      </h3>
      <p className="text-sm text-foreground/70">
        Confira as avaliações de clientes que já tiveram experiências com a
        BEZEL.
      </p>
      <Button
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        className="self-start"
      >
        Ver avaliações no Google
      </Button>
    </div>
  );
}