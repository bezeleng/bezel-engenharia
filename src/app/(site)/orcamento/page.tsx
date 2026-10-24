import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { OrcamentoForm } from "@/components/forms/OrcamentoForm";

export const metadata: Metadata = {
  title: "Orçamento de Construção no Vale do Paraíba",
  description:
    "Solicite orçamento com a BEZEL para projetos, construção, gerenciamento de obras, Steel Frame e BlocoK no Vale do Paraíba.",
  alternates: {
    canonical: "/orcamento",
  },
  openGraph: {
    title: "Solicite um Orçamento | BEZEL",
    description:
      "Peça uma proposta para sua obra no Vale do Paraíba com a equipe da BEZEL.",
    url: "https://bezel.com.br/orcamento",
    type: "website",
  },
};

export default function OrcamentoPage() {
  return (
    <section className="py-20">
      <Container className="mx-auto max-w-2xl">
        <SectionTitle
          eyebrow="Vamos começar"
          title="Solicitar Orçamento"
          description="Preencha os dados abaixo e nossa equipe entrará em contato com uma proposta personalizada."
          align="center"
        />
        <div className="mt-12">
          <OrcamentoForm />
        </div>
      </Container>
    </section>
  );
}