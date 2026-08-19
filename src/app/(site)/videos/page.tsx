import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import {
  videosQuery,
  categoriasVideoUsadasQuery,
} from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { VideosContent } from "@/components/sections/VideosContent";

export const metadata: Metadata = {
  title: "Vídeos",
  description:
    "Acompanhe conteúdos sobre construção, gerenciamento de obras, materiais, processos executivos e bastidores dos nossos projetos.",
  alternates: {
    canonical: "/videos",
  },
};

export default async function VideosPage() {
  const { data: videos } = await sanityFetch({ query: videosQuery });
  const { data: categoriasComVideo } = await sanityFetch({
    query: categoriasVideoUsadasQuery,
  });

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="Conteúdo"
          title="Obras, Técnica e Conhecimento"
          description="Acompanhe conteúdos sobre construção, gerenciamento de obras, materiais, processos executivos e bastidores dos nossos projetos."
        />
        {videos && videos.length > 0 ? (
          <VideosContent
            videos={videos}
            categoriasComVideo={categoriasComVideo ?? []}
          />
        ) : (
          <p className="text-foreground/60">Nenhum vídeo cadastrado ainda.</p>
        )}
      </Container>
    </section>
  );
}