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