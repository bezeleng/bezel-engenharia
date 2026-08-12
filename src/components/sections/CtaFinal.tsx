// src/components/sections/CtaFinal.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { paginaInicialQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export async function CtaFinal() {
  const { data: paginaInicial } = await sanityFetch({
    query: paginaInicialQuery,
  });

  if (!paginaInicial?.tituloCtaFinal) return null;

  return (
    <section className="bg-navy py-20">
      <Container className="flex flex-col items-center gap-6 text-center text-white">
        <h2 className="font-display max-w-xl text-3xl sm:text-4xl">
          {paginaInicial.tituloCtaFinal}
        </h2>
        {paginaInicial.subtituloCtaFinal && (
          <p className="max-w-lg text-white/80">
            {paginaInicial.subtituloCtaFinal}
          </p>
        )}
        {paginaInicial.textoBotaoCtaFinal && paginaInicial.linkBotaoCtaFinal && (
          <Button href={paginaInicial.linkBotaoCtaFinal} variant="primary">
            {paginaInicial.textoBotaoCtaFinal}
          </Button>
        )}
      </Container>
    </section>
  );
}