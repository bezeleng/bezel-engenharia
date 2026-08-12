// src/app/(site)/sobre/page.tsx
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { paginaSobreQuery, membrosEquipeQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PortableTextContent } from "@/components/ui/PortableTextContent";
import { MembroCard } from "@/components/sections/MembroCard";

export default async function SobrePage() {
  const { data: pagina } = await sanityFetch({ query: paginaSobreQuery });

  if (!pagina) return null;

  const { data: membros } = await sanityFetch({ query: membrosEquipeQuery });

  const imagemUrl = pagina.imagemDestaque
    ? urlFor(pagina.imagemDestaque).width(1200).height(800).url()
    : null;

  return (
    <>
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle eyebrow="Nossa história" title={pagina.titulo} />
            {pagina.textoIntroducao && (
              <div className="mt-6">
                <PortableTextContent value={pagina.textoIntroducao} />
              </div>
            )}
          </div>
          {imagemUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={imagemUrl}
                alt={pagina.titulo}
                fill
                className="object-cover"
              />
            </div>
          )}
        </Container>
      </section>

      {(pagina.missao || pagina.visao) && (
        <section className="bg-navy/[0.03] py-20">
          <Container className="grid gap-8 sm:grid-cols-2">
            {pagina.missao && (
              <div>
                <h3 className="font-display text-xl text-navy">Missão</h3>
                <p className="mt-3 text-foreground/70">{pagina.missao}</p>
              </div>
            )}
            {pagina.visao && (
              <div>
                <h3 className="font-display text-xl text-navy">Visão</h3>
                <p className="mt-3 text-foreground/70">{pagina.visao}</p>
              </div>
            )}
          </Container>
        </section>
      )}

      {pagina.valores && pagina.valores.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionTitle title="Nossos Valores" align="center" />
            <ul className="mt-8 flex flex-wrap justify-center gap-4">
              {pagina.valores.map((valor) => (
                <li
                  key={valor}
                  className="rounded-full border border-gold px-5 py-2 text-sm text-navy"
                >
                  {valor}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {pagina.mostrarEquipe && membros && membros.length > 0 && (
        <section className="bg-navy/[0.03] py-20">
          <Container className="flex flex-col gap-12">
            <SectionTitle
              eyebrow="Quem somos"
              title="Nossa Equipe"
              align="center"
            />
            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {membros.map((membro) => (
                <MembroCard
                  key={membro._id}
                  nome={membro.nome}
                  cargo={membro.cargo}
                  foto={membro.foto}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}