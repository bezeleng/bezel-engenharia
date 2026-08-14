// src/app/(site)/contato/page.tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContatoForm } from "@/components/forms/ContatoForm";

export const metadata: Metadata = {
  title: "Contato | BEZEL Engenharia",
  description: "Entre em contato com a BEZEL Engenharia.",
};

export default async function ContatoPage() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });

  return (
    <section className="py-20">
      <Container className="grid gap-12 lg:grid-cols-2">
        <div>
          <SectionTitle
            eyebrow="Fale conosco"
            title="Entre em Contato"
            description="Preencha o formulário ou utilize um dos canais abaixo."
          />
          <div className="mt-8 flex flex-col gap-2 text-navy">
            {config?.telefone && <p>Telefone: {config.telefone}</p>}
            {config?.email && <p>E-mail: {config.email}</p>}
            {config?.endereco && <p>Endereço: {config.endereco}</p>}
          </div>
        </div>
        <ContatoForm />
      </Container>
    </section>
  );
}