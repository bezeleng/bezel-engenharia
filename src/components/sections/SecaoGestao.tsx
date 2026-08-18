// src/components/sections/SecaoGestao.tsx
import { sanityFetch } from "@/sanity/lib/live";
import { paginaInicialQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";

export async function SecaoGestao() {
  const { data: paginaInicial } = await sanityFetch({
    query: paginaInicialQuery,
  });

  if (!paginaInicial?.tituloGestao) return null;

  return (
    <section className="bg-navy py-16">
      <Container className="flex flex-col items-center gap-4 text-center text-white">
        <h2 className="font-display max-w-2xl text-2xl uppercase tracking-wide sm:text-3xl">
          {paginaInicial.tituloGestao}
        </h2>
        {paginaInicial.textoGestao && (
          <p className="max-w-2xl text-white/80">{paginaInicial.textoGestao}</p>
        )}
      </Container>
    </section>
  );
}