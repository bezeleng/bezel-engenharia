// src/sanity/schemaTypes/video.ts
import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Vídeo",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "titulo", maxLength: 96 },
    }),
    defineField({
      name: "url",
      title: "URL do Vídeo (YouTube ou Vimeo)",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "reference",
      to: [{ type: "categoriaVideo" }],
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Personalizada",
      type: "image",
      options: { hotspot: true },
      description:
        "Opcional. Para YouTube, se vazio, usamos a miniatura automática da plataforma. Para Vimeo, recomendamos sempre enviar uma thumbnail.",
    }),
    defineField({
      name: "descricaoCurta",
      title: "Descrição Curta",
      type: "text",
      rows: 2,
      description: "Usada no card da grade de vídeos.",
    }),
    defineField({
      name: "descricaoCompleta",
      title: "Descrição Completa",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "dataPublicacao",
      title: "Data de Publicação",
      type: "date",
    }),
    defineField({
      name: "duracao",
      title: "Duração",
      type: "string",
      description: 'Ex: "12:34" ou "15 min".',
    }),
    defineField({
      name: "destaque",
      title: "Vídeo em Destaque",
      type: "boolean",
      initialValue: false,
      description: "Aparece em card maior no topo da página de Vídeos.",
    }),
    defineField({
      name: "obraRelacionada",
      title: "Obra Relacionada",
      type: "reference",
      to: [{ type: "obra" }],
      description: "Preparado para uso futuro — ainda não exibido em Obras.",
    }),
    defineField({
      name: "servicoRelacionado",
      title: "Serviço Relacionado",
      type: "reference",
      to: [{ type: "servico" }],
      description: "Preparado para uso futuro — ainda não exibido em Serviços.",
    }),
  ],
});