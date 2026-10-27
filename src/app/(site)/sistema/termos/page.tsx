import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Termos de Uso — BEZEL Gestão",
  description: "Termos de Uso do sistema e aplicativo BEZEL Gestão.",
  alternates: { canonical: "/sistema/termos" },
};

export default async function TermosSistemaPage() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-text">BEZEL Gestão</p>
        <h1 className="mt-3 font-display text-3xl text-navy sm:text-4xl">Termos de Uso</h1>
        <p className="mt-4 leading-7 text-navy/75">
          Estes Termos regulam o acesso e uso do BEZEL Gestão, incluindo sua versão web,
          aplicativo móvel e funcionalidades associadas.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-navy/80">
          <section>
            <h2 className="font-display text-2xl text-navy">1. Aceitação</h2>
            <p className="mt-3">
              Ao criar uma conta, acessar ou utilizar o BEZEL Gestão, o usuário declara ter lido
              e concordado com estes Termos e com a Política de Privacidade do produto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">2. Finalidade do produto</h2>
            <p className="mt-3">
              O BEZEL Gestão é uma plataforma de apoio à organização e gestão de obras, processos,
              documentos, equipe, compras, financeiro e demais rotinas disponibilizadas conforme
              o plano e a versão contratados.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">3. Conta e segurança</h2>
            <p className="mt-3">
              O usuário é responsável por manter suas credenciais seguras, informar dados corretos,
              impedir o uso indevido de sua conta e comunicar situações de acesso não autorizado.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">4. Uso adequado</h2>
            <p className="mt-3">
              É proibido utilizar o sistema para finalidades ilícitas, violar direitos de terceiros,
              tentar contornar mecanismos de segurança, introduzir conteúdo malicioso ou interferir
              indevidamente no funcionamento da plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">5. Conteúdo inserido pelo usuário</h2>
            <p className="mt-3">
              O usuário permanece responsável pelos dados, documentos, imagens e informações que
              inserir no sistema, inclusive quanto à legitimidade, confidencialidade e autorização
              para tratamento desses conteúdos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">6. Disponibilidade e evolução</h2>
            <p className="mt-3">
              Funcionalidades podem ser alteradas, aprimoradas, substituídas ou descontinuadas ao
              longo da evolução do produto. Recursos em desenvolvimento, beta ou ainda não liberados
              não devem ser considerados parte definitiva da oferta comercial.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">7. Planos, cobrança e assinaturas</h2>
            <p className="mt-3">
              Preços, limites, periodicidade, renovação e condições de cancelamento serão apresentados
              no momento da contratação e poderão variar de acordo com o canal utilizado, inclusive
              App Store, Google Play ou contratação web, quando esses canais estiverem disponíveis.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">8. Limitação de responsabilidade</h2>
            <p className="mt-3">
              O BEZEL Gestão é uma ferramenta de apoio à gestão. Informações, alertas, projeções e
              recursos inteligentes não substituem responsabilidade técnica, análise profissional,
              validação documental, conferência financeira ou decisão de engenharia, arquitetura,
              segurança ou gestão pelo usuário responsável.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">9. Encerramento e exclusão</h2>
            <p className="mt-3">
              O usuário poderá cancelar sua utilização conforme as regras do plano contratado e
              solicitar a exclusão da conta pelos mecanismos disponibilizados no produto. Consulte{" "}
              <Link href="/sistema/excluir-conta" className="font-medium text-gold-text hover:underline">
                a página de exclusão de conta
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">10. Contato</h2>
            <p className="mt-3">
              Para suporte ou dúvidas sobre estes Termos, utilize nossa página de{" "}
              <Link href="/sistema/suporte" className="font-medium text-gold-text hover:underline">
                suporte
              </Link>
              {config?.email ? <> ou o e-mail {config.email}</> : null}.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-navy/10 pt-6 text-sm text-navy/65">
          <Link href="/sistema" className="hover:text-gold-text">← Voltar ao BEZEL Gestão</Link>
        </div>
      </Container>
    </section>
  );
}
