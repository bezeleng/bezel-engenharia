import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { OrcamentoForm } from "@/components/forms/OrcamentoForm";

export const metadata: Metadata = {
  title: "Solicitar Orçamento",
  description: "Solicite um orçamento para o seu projeto com a BEZEL Engenharia.",
  alternates: {
    canonical: "/orcamento",
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