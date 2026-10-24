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
  }));

  const paginasServicos: MetadataRoute.Sitemap = (servicos as Array<{ slug: string; _updatedAt?: string }>).map(({ slug, _updatedAt }) => ({
    url: `${BASE_URL}/servicos/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : undefined,
  }));

  const paginasProjetos: MetadataRoute.Sitemap = (projetos as Array<{ slug: string; _updatedAt?: string }>).map(({ slug, _updatedAt }) => ({
    url: `${BASE_URL}/projetos/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : undefined,
  }));

  const paginasObras: MetadataRoute.Sitemap = (obras as Array<{ slug: string; _updatedAt?: string }>).map(({ slug, _updatedAt }) => ({
    url: `${BASE_URL}/obras/${slug}`,
    lastModified: _updatedAt ? new Date(_updatedAt) : undefined,
  }));

  return [
    ...paginasEstaticas,
    ...paginasServicos,
    ...paginasProjetos,
    ...paginasObras,
  ];
}
