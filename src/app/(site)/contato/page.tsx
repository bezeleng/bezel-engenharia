// src/app/(site)/contato/page.tsx
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ContatoForm } from "@/components/forms/ContatoForm";
import { MapaLocalizacao } from "@/components/sections/MapaLocalizacao";
import { AvaliacoesGoogle } from "@/components/sections/AvaliacoesGoogle";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a BEZEL Engenharia em Jacareí, atendendo Jacareí, São José dos Campos e o Vale do Paraíba.",
  alternates: {
    canonical: "/contato",
  },
};

export default async function ContatoPage() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });

  const enderecoCompleto = [config?.logradouro, config?.cidade, config?.estado]
    .filter(Boolean)
    .join(", ");
  const linkComoChegar = enderecoCompleto
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        enderecoCompleto
      )}`
    : null;

  return (
    <>
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

      {config?.logradouro && (
        <section className="bg-navy/[0.03] py-20">
          <Container className="flex flex-col gap-8">
            <SectionTitle title="Onde estamos" />
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <MapaLocalizacao
                logradouro={config.logradouro}
                cidade={config.cidade}
                estado={config.estado}
                cep={config.cep}
              />
              <div className="flex flex-col gap-4">
                <p className="text-navy">
                  {config.logradouro}
                  {config.cidade && ` — ${config.cidade}/${config.estado}`}
                </p>
                {linkComoChegar && (
                  <Button
                    href={linkComoChegar}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    className="self-start"
                  >
                    Como chegar
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}

      {config?.linkAvaliacoesGoogle && (
        <section className="py-20">
          <Container className="max-w-2xl">
            <AvaliacoesGoogle link={config.linkAvaliacoesGoogle} />
          </Container>
        </section>
      )}
    </>
  );
}