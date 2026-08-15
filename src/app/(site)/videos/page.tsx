import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { videosQuery } from "@/sanity/lib/queries";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { VideoCard } from "@/components/sections/VideoCard";

export const metadata: Metadata = {
  title: "Vídeos",
  description: "Assista aos vídeos institucionais e de obras da BEZEL.",
  alternates: {
    canonical: "/videos",
  },
};

export default async function VideosPage() {
  const { data: videos } = await sanityFetch({ query: videosQuery });

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionTitle
          eyebrow="Conteúdo"
          title="Vídeos"
          description="Acompanhe de perto nossos projetos e bastidores em vídeo."
        />
        {videos && videos.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                titulo={video.titulo}
                url={video.url}
                thumbnail={video.thumbnail}
              />
            ))}
          </div>
        ) : (
          <p className="text-foreground/60">Nenhum vídeo cadastrado ainda.</p>
        )}
      </Container>
    </section>
  );
}