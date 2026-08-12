import { defineQuery } from "next-sanity";

export const configuracaoSiteQuery = defineQuery(
  `*[_type == "configuracaoSite"][0]`
);

export const paginaInicialQuery = defineQuery(
  `*[_type == "paginaInicial"][0]`
);