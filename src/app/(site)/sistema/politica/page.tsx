import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { sanityFetch } from "@/sanity/lib/live";
import { configuracaoSiteQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Política de Privacidade — BEZEL Gestão",
  description:
    "Política de Privacidade do BEZEL Gestão, incluindo tratamento de dados no sistema e aplicativo.",
  alternates: { canonical: "/sistema/politica" },
};

export default async function PoliticaSistemaPage() {
  const { data: config } = await sanityFetch({ query: configuracaoSiteQuery });

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-text">
          BEZEL Gestão
        </p>
        <h1 className="mt-3 font-display text-3xl text-navy sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="mt-4 leading-7 text-navy/75">
          Esta Política de Privacidade explica como o BEZEL Gestão trata dados pessoais
          relacionados ao uso do sistema web, aplicativo móvel e recursos associados.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-navy/80">
          <section>
            <h2 className="font-display text-2xl text-navy">1. Quem é o responsável pelo tratamento</h2>
            <p className="mt-3">
              O BEZEL Gestão é operado pela {config?.nomeEmpresa || "BEZEL"}. Quando aplicável,
              os dados de contato, CNPJ e demais informações institucionais exibidos neste site
              identificam o responsável pelo produto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">2. Dados que podem ser tratados</h2>
            <p className="mt-3">
              Dependendo dos módulos utilizados, o sistema pode tratar dados de cadastro,
              autenticação, equipe, obras, clientes, fornecedores, documentos, fotos, registros
              de diário, cronogramas, compras, informações financeiras, dados operacionais,
              localização associada à obra, registros de uso e informações enviadas pelo próprio
              usuário.
            </p>
            <p className="mt-3">
              Recursos de voz, notificações, analytics, integrações e outros serviços de terceiros
              somente devem ser considerados quando estiverem efetivamente habilitados no produto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">3. Finalidades</h2>
            <p className="mt-3">
              Os dados podem ser utilizados para permitir o funcionamento do sistema, autenticar
              usuários, organizar informações de obra, disponibilizar funcionalidades contratadas,
              prestar suporte, manter segurança, prevenir abuso, melhorar o produto e cumprir
              obrigações legais ou regulatórias.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">4. Compartilhamento e fornecedores</h2>
            <p className="mt-3">
              O BEZEL Gestão pode utilizar provedores de infraestrutura, hospedagem, banco de dados,
              autenticação, armazenamento, comunicação, analytics, pagamento e outros serviços
              necessários à operação. Esses fornecedores devem receber apenas os dados necessários
              para a finalidade contratada e ficam sujeitos às suas próprias obrigações de
              segurança e privacidade.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">5. Retenção e segurança</h2>
            <p className="mt-3">
              Os dados são mantidos pelo período necessário para prestar o serviço, atender
              obrigações legais, preservar registros legítimos e permitir o exercício de direitos.
              São adotadas medidas técnicas e organizacionais compatíveis com a natureza das
              informações tratadas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">6. Direitos do titular</h2>
            <p className="mt-3">
              O titular pode solicitar informações sobre o tratamento de seus dados, correção,
              atualização, portabilidade quando aplicável, oposição, revogação de consentimento
              quando esta for a base utilizada e exclusão nos casos previstos em lei.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">7. Exclusão de conta</h2>
            <p className="mt-3">
              Informações sobre exclusão de conta estão disponíveis em{" "}
              <Link href="/sistema/excluir-conta" className="font-medium text-gold-text hover:underline">
                bezel.com.br/sistema/excluir-conta
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">8. Contato</h2>
            <p className="mt-3">
              Dúvidas sobre privacidade ou tratamento de dados podem ser encaminhadas pelos canais
              informados em nossa página de{" "}
              <Link href="/sistema/suporte" className="font-medium text-gold-text hover:underline">
                suporte do BEZEL Gestão
              </Link>.
              {config?.email ? <> E-mail: {config.email}.</> : null}
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">9. Atualizações desta política</h2>
            <p className="mt-3">
              Esta política pode ser atualizada para refletir mudanças no produto, na legislação
              ou nos serviços utilizados. A versão vigente será sempre disponibilizada nesta URL.
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
