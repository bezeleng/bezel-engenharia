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
      name: "url",
      title: "URL do Vídeo (YouTube ou Vimeo)",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "reference",
      to: [{ type: "categoria" }],
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Customizada",
      type: "image",
      description: "Opcional. Se vazio, tentamos usar a miniatura padrão da plataforma.",
    }),
  ],
});