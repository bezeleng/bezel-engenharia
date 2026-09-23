import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { paginaInicialQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/ui/Container";

export async function GaleriaDestaquesHome() {
  const { data: paginaInicial } = await sanityFetch({
    query: paginaInicialQuery,
  });

  const itens = paginaInicial?.galeriaDestaques?.filter(
    (item) => item?.titulo && item?.imagem
  );

  if (!itens?.length) return null;

  return (
    <section className="bg-white py-14 sm:py-16">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((item) => {
            const imagemUrl = urlFor(item.imagem!)
              .width(1000)
              .height(700)
              .fit("crop")
              .url();

            return (
              <article key={item._key} className="flex min-w-0 flex-col">
                <div className="mb-3 flex min-h-8 items-end justify-center px-1">
                  <h3 className="font-display whitespace-nowrap text-center text-base text-navy sm:text-lg lg:text-[19px]">
                    {item.titulo}
                  </h3>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 bg-neutral-100 shadow-sm">
                  <Image
                    src={imagemUrl}
                    alt={item.titulo ?? ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
