import { defineQuery } from "next-sanity";

export const configuracaoSiteQuery = defineQuery(
  `*[_type == "configuracaoSite"][0]`
);

export const paginaInicialQuery = defineQuery(
  `*[_type == "paginaInicial"][0]`
);

export const servicosQuery = defineQuery(
  `*[_type == "servico"] | order(ordem asc)`
);
export const projetosDestaqueQuery = defineQuery(
  `*[_type == "projeto"] | order(_createdAt desc)[0...6]{
    _id,
    titulo,
    slug,
    capa,
    categoria->{nome}
  }`
);
export const paginaSobreQuery = defineQuery(
  `*[_type == "paginaSobre"][0]`
);

export const membrosEquipeQuery = defineQuery(
  `*[_type == "membroEquipe"] | order(ordem asc)`
);
export const servicoBySlugQuery = defineQuery(
  `*[_type == "servico" && slug.current == $slug][0]`
);

export const servicoSlugsQuery = defineQuery(
  `*[_type == "servico"]{ "slug": slug.current }`
);
export const projetosQuery = defineQuery(
  `*[_type == "projeto"] | order(_createdAt desc){
    _id, titulo, slug, capa, categoria->{nome}
  }`
);

export const projetoBySlugQuery = defineQuery(
  `*[_type == "projeto" && slug.current == $slug][0]{
    ...,
    categoria->{nome}
  }`
);

export const projetoSlugsQuery = defineQuery(
  `*[_type == "projeto"]{ "slug": slug.current }`
);

export const obrasQuery = defineQuery(
  `*[_type == "obra"] | order(_createdAt desc){
    _id, titulo, slug, capa, status, categoria->{nome}
  }`
);

export const obraBySlugQuery = defineQuery(
  `*[_type == "obra" && slug.current == $slug][0]{
    ...,
    categoria->{nome}
  }`
);

export const obraSlugsQuery = defineQuery(
  `*[_type == "obra"]{ "slug": slug.current }`
);
export const videosQuery = defineQuery(
  `*[_type == "video"] | order(_createdAt desc)`
);
export const depoimentosQuery = defineQuery(
  `*[_type == "depoimento"] | order(_createdAt desc)`
);
export const politicaPrivacidadeQuery = defineQuery(
  `*[_type == "politicaPrivacidade"][0]`
);