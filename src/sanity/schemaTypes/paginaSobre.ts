// src/sanity/schemaTypes/paginaSobre.ts
import { defineField, defineType } from "sanity";

export const paginaSobre = defineType({
  name: "paginaSobre",
  title: "Página Sobre",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      initialValue: "Sobre a BEZEL",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textoIntroducao",
      title: "Texto de Introdução",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "imagemDestaque",
      title: "Imagem de Destaque",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "missao",
      title: "Missão",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "visao",
      title: "Visão",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "valores",
      title: "Valores",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "mostrarEquipe",
      title: "Mostrar seção de equipe nesta página?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});