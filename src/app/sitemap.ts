// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  servicoSlugsQuery,
  projetoSlugsQuery,
  obraSlugsQuery,
} from "@/sanity/lib/queries";

const BASE_URL = "https://bezel.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [servicos, projetos, obras] = await Promise.all([
    client.fetch(servicoSlugsQuery),
    client.fetch(projetoSlugsQuery),
    client.fetch(obraSlugsQuery),
  ]);

  const paginasEstaticas: MetadataRoute.Sitemap = [
    "",
    "sobre",
    "servicos",
    "projetos",
    "obras",
    "videos",
    "depoimentos",
    "contato",
    "orcamento",
    "politica-de-privacidade",
  ].map((rota) => ({
    url: `${BASE_URL}/${rota}`,
    lastModified: new Date(),
  }));

  const paginasServicos: MetadataRoute.Sitemap = servicos.map(({ slug }) => ({
    url: `${BASE_URL}/servicos/${slug}`,
    lastModified: new Date(),
  }));

  const paginasProjetos: MetadataRoute.Sitemap = projetos.map(({ slug }) => ({
    url: `${BASE_URL}/projetos/${slug}`,
    lastModified: new Date(),
  }));

  const paginasObras: MetadataRoute.Sitemap = obras.map(({ slug }) => ({
    url: `${BASE_URL}/obras/${slug}`,
    lastModified: new Date(),
  }));

  return [
    ...paginasEstaticas,
    ...paginasServicos,
    ...paginasProjetos,
    ...paginasObras,
  ];
}