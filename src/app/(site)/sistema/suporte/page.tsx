import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Suporte — BEZEL Gestão",
  description: "Canais de suporte e atendimento do BEZEL Gestão.",
  alternates: { canonical: "/sistema/suporte" },
};

export default async function SuporteSistemaPage() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });
  const whatsapp = config?.whatsapp
    ? `https://wa.me/${config.whatsapp}?text=${encodeURIComponent("Olá! Preciso de suporte com o BEZEL Gestão.")}`
    : null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-text">BEZEL Gestão</p>
        <h1 className="mt-3 font-display text-3xl text-navy sm:text-4xl">Suporte</h1>
        <p className="mt-4 max-w-2xl leading-7 text-navy/75">
          Use esta página para dúvidas sobre acesso, conta, funcionamento do produto, privacidade
          ou solicitações relacionadas ao BEZEL Gestão.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {config?.email && (
            <a
              href={`mailto:${config.email}?subject=${encodeURIComponent("Suporte BEZEL Gestão")}`}
              className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-gold/50"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-text">E-mail</span>
              <strong className="mt-3 block text-lg text-navy">{config.email}</strong>
              <p className="mt-2 text-sm leading-6 text-navy/65">Envie sua dúvida com o máximo de contexto possível.</p>
            </a>
          )}

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm transition hover:border-gold/50"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-text">WhatsApp</span>
              <strong className="mt-3 block text-lg text-navy">Falar com a equipe</strong>
              <p className="mt-2 text-sm leading-6 text-navy/65">Atendimento para dúvidas sobre o produto e a conta.</p>
            </a>
          )}
        </div>

        <div className="mt-10 rounded-3xl bg-navy p-6 text-white sm:p-8">
          <h2 className="font-display text-2xl">Antes de entrar em contato</h2>
          <p className="mt-3 text-sm leading-7 text-white/75">
            Informe, quando possível, seu nome, empresa, e-mail da conta, descrição do problema,
            dispositivo utilizado e uma explicação do que aconteceu. Não envie senhas ou códigos
            de autenticação.
          </p>
        </div>

        <div className="mt-10 grid gap-3 text-sm">
          <Link href="/sistema/politica" className="text-gold-text hover:underline">Política de Privacidade</Link>
          <Link href="/sistema/termos" className="text-gold-text hover:underline">Termos de Uso</Link>
          <Link href="/sistema/excluir-conta" className="text-gold-text hover:underline">Exclusão de Conta</Link>
        </div>

        <div className="mt-12 border-t border-navy/10 pt-6 text-sm text-navy/65">
          <Link href="/sistema" className="hover:text-gold-text">← Voltar ao BEZEL Gestão</Link>
        </div>
      </Container>
    </section>
  );
}
