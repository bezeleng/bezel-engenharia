// src/components/sections/Diferenciais.tsx
import { Container } from "@/components/ui/Container";

interface DiferencialItem {
  titulo?: string;
  descricao?: string;
}

interface DiferenciaisProps {
  titulo?: string;
  subtitulo?: string;
  texto?: string;
  itens?: DiferencialItem[];
}

export function Diferenciais({
  titulo,
  subtitulo,
  texto,
  itens,
}: DiferenciaisProps) {
  if (!titulo) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col items-center gap-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl text-navy sm:text-4xl">
            {titulo}
          </h2>

          {subtitulo && (
            <p className="mt-3 text-lg font-medium text-gold-text">
              {subtitulo}
            </p>
          )}

          {texto && (
            <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
              {texto}
            </p>
          )}
        </div>

        {itens && itens.length > 0 && (
          <div className="mx-auto grid w-full max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {itens.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="font-display text-3xl text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-lg text-navy">
                  {item.titulo}
                </h3>

                <p className="text-sm text-foreground/70">
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}