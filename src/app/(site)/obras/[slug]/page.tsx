import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { obraBySlugQuery, obraSlugsQuery } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { FichaTecnicaObra } from "@/components/sections/FichaTecnicaObra";
import { GaleriaObra } from "@/components/sections/GaleriaObra";
import { ListaSimples } from "@/components/sections/ListaSimples";

export async function generateStaticParams() {
  const slugs = await client.fetch(obraSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

interface ObraPageProps {
  params: Promise<{ slug: string }>;
}

const statusLabel: Record<string, string> = {
  em_andamento: "Em Andamento",
  concluida: "Concluída",
};

const servicoLabel: Record<string, string> = {
  gerenciamento_de_obras: "Gerenciamento de Obras",
  execucao_da_obra: "Execução da Obra",
  planejamento: "Planejamento",
  orcamento: "Orçamento",
  estudo_de_viabilidade: "Estudo de Viabilidade",
  gestao_de_compras_e_fornecedores: "Gestão de Compras e Fornecedores",
  acompanhamento_tecnico: "Acompanhamento Técnico",
  projeto_arquitetonico: "Projeto Arquitetônico",
  projeto_de_engenharia: "Projeto de Engenharia",
};

export async function generateMetadata({
  params,
}: ObraPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: obra } = await sanityFetch({
    query: obraBySlugQuery,
    params: { slug },
  });

  if (!obra) return {};

  return {
    title: obra.seo?.metaTitulo || obra.titulo,
    description: obra.seo?.metaDescricao,
    alternates: {
      canonical: `/obras/${slug}`,
    },
  };
}

export default async function ObraPage({ params }: ObraPageProps) {
  const { slug } = await params;
  const { data: obra } = await sanityFetch({
    query: obraBySlugQuery,
    params: { slug },
  });

  if (!obra) notFound();

  const capaUrl = obra.capa
    ? urlFor(obra.capa).width(1600).height(900).url()
    : null;

  return (
    <>
      <section className="py-16">
        <Container className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-3">
            {obra.categoria?.nome && (
              <span className="text-sm font-medium uppercase tracking-widest text-gold-text">
                {obra.categoria.nome}
              </span>
            )}
            {obra.status && (
              <span className="rounded-full bg-navy px-3 py-1 text-xs font-medium text-white">
                {statusLabel[obra.status] ?? obra.status}
              </span>
            )}
          </div>
          <h1 className="font-display -mt-4 text-3xl text-navy sm:text-4xl">
            {obra.titulo}
          </h1>

          {capaUrl && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={capaUrl}
                alt={obra.titulo ?? ""}
                fill
                className="object-cover"
              />
            </div>
          )}

          <FichaTecnicaObra
            tipoObra={obra.tipoObra}
            localizacao={obra.localizacao}
            area={obra.area}
            metragemTerreno={obra.metragemTerreno}
            metragemConstruida={obra.metragemConstruida}
            ano={obra.ano}
            prazoObra={obra.prazoObra}
            status={obra.status}
            cliente={obra.cliente}
            exibirClientePublicamente={obra.exibirClientePublicamente}
          />

          {obra.descricao && (
            <div className="max-w-3xl">
              <h2 className="font-display text-xl text-navy">
                Sobre a Obra
              </h2>
              <div className="mt-4">
                <PortableTextContent value={obra.descricao} />
              </div>
            </div>
          )}

          {obra.servicosRealizados && obra.servicosRealizados.length > 0 && (
            <div>
              <h2 className="font-display text-xl text-navy">
                Escopo BEZEL
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {obra.servicosRealizados.map((servico) => (
                  <span
                    key={servico}
                    className="rounded-full border border-gold px-4 py-1.5 text-sm text-navy"
                  >
                    {servicoLabel[servico] ?? servico}
                  </span>
                ))}
              </div>
            </div>
          )}

          {obra.desafioObra && (
            <div className="max-w-3xl">
              <h2 className="font-display text-xl text-navy">O Desafio</h2>
              <div className="mt-4">
                <PortableTextContent value={obra.desafioObra} />
              </div>
            </div>
          )}

          {obra.solucaoBezel && (
            <div className="max-w-3xl">
              <h2 className="font-display text-xl text-navy">
                Nossa Solução
              </h2>
              <div className="mt-4">
                <PortableTextContent value={obra.solucaoBezel} />
              </div>
            </div>
          )}

          <ListaSimples
            titulo="Serviços Executados"
            itens={obra.principaisServicos}
          />

          {obra.galeria && obra.galeria.length > 0 && (
            <div>
              <h2 className="font-display text-xl text-navy">
                Galeria da Obra
              </h2>
              <div className="mt-6">
                <GaleriaObra itens={obra.galeria} />
              </div>
            </div>
          )}

          <ListaSimples
            titulo="Resultados / Destaques"
            itens={obra.resultadosDestaques}
          />
        </Container>
      </section>

      <section className="bg-navy py-16">
        <Container className="flex flex-col items-center gap-4 text-center text-white">
          <h2 className="font-display text-2xl sm:text-3xl">
            Está planejando construir ou reformar?
          </h2>
          <p className="max-w-lg text-white/80">
            Converse com a BEZEL e descubra como podemos planejar, gerenciar
            e executar sua obra com mais segurança, controle e
            previsibilidade.
          </p>
          <Button href="/orcamento" variant="primary">
            Solicitar Orçamento
          </Button>
        </Container>
      </section>
    </>
  );
}