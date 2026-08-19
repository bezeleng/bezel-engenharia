// src/sanity/schemaTypes/categoriaVideo.ts
import { defineField, defineType } from "sanity";

export const categoriaVideo = defineType({
  name: "categoriaVideo",
  title: "Categoria de Vídeo",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "nome", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
  ],
});