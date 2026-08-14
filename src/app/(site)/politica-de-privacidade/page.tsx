// src/app/(site)/politica-de-privacidade/page.tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { politicaPrivacidadeQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { PortableTextContent } from "@/components/ui/PortableTextContent";

export const metadata: Metadata = {
  title: "Política de Privacidade | BEZEL Engenharia",
};

export default async function PoliticaPrivacidadePage() {
  const { data: pagina } = await sanityFetch({
    query: politicaPrivacidadeQuery,
  });

  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">
          {pagina?.titulo ?? "Política de Privacidade"}
        </h1>
        {pagina?.conteudo && (
          <div className="mt-8">
            <PortableTextContent value={pagina.conteudo} />
          </div>
        )}
      </Container>
    </section>
  );
}