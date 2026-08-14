// src/sanity/schemaTypes/politicaPrivacidade.ts
import { defineField, defineType } from "sanity";

export const politicaPrivacidade = defineType({
  name: "politicaPrivacidade",
  title: "Política de Privacidade",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      initialValue: "Política de Privacidade",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "conteudo",
      title: "Conteúdo",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});