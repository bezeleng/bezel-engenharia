import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Exclusão de Conta — BEZEL Gestão",
  description: "Informações para solicitar exclusão de conta e dados do BEZEL Gestão.",
  alternates: { canonical: "/sistema/excluir-conta" },
};

export default async function ExcluirContaSistemaPage() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });

  const emailLink = config?.email
    ? `mailto:${config.email}?subject=${encodeURIComponent("Solicitação de exclusão de conta — BEZEL Gestão")}&body=${encodeURIComponent("Olá, gostaria de solicitar a exclusão da minha conta do BEZEL Gestão.\n\nE-mail da conta:\nEmpresa:\nObservações:")}`
    : null;

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-text">BEZEL Gestão</p>
        <h1 className="mt-3 font-display text-3xl text-navy sm:text-4xl">Exclusão de Conta</h1>
        <p className="mt-4 leading-7 text-navy/75">
          Esta página explica como solicitar a exclusão de uma conta e dos dados pessoais
          associados ao BEZEL Gestão.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-navy/80">
          <section>
            <h2 className="font-display text-2xl text-navy">Como solicitar</h2>
            <p className="mt-3">
              Quando o aplicativo comercial estiver disponível, a opção de iniciar a exclusão da
              conta deverá estar acessível dentro do próprio produto, em uma área de conta ou
              configurações. Enquanto o produto estiver em desenvolvimento ou homologação, a
              solicitação também pode ser encaminhada ao suporte.
            </p>
            {emailLink && (
              <a
                href={emailLink}
                className="mt-5 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold/90"
              >
                Solicitar exclusão por e-mail
              </a>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">O que pode ser solicitado</h2>
            <p className="mt-3">
              A solicitação pode abranger o encerramento da conta e a exclusão de dados pessoais
              vinculados ao usuário, observadas as informações que precisem ser preservadas por
              obrigação legal, exercício regular de direitos, segurança, prevenção a fraude ou
              cumprimento de obrigações contratuais.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">Dados de empresas e obras</h2>
            <p className="mt-3">
              Em ambientes empresariais, determinados registros podem pertencer à organização
              contratante ou envolver outros usuários. Nesses casos, a exclusão da conta individual
              não necessariamente implica a eliminação de todos os registros operacionais da empresa.
              Cada solicitação será tratada conforme a titularidade e a finalidade dos dados.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">Identificação da solicitação</h2>
            <p className="mt-3">
              Para proteger a conta, poderá ser necessário confirmar a identidade do solicitante
              antes de efetivar a exclusão. Nunca envie senha, código de autenticação ou credencial
              de acesso ao suporte.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">Dúvidas</h2>
            <p className="mt-3">
              Para outras questões sobre dados pessoais, consulte a{" "}
              <Link href="/sistema/politica" className="font-medium text-gold-text hover:underline">
                Política de Privacidade
              </Link>{" "}
              ou a página de{" "}
              <Link href="/sistema/suporte" className="font-medium text-gold-text hover:underline">
                suporte
              </Link>.
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
