// src/sanity/schemaTypes/paginaInicial.ts
import { defineField, defineType } from "sanity";

export const paginaInicial = defineType({
  name: "paginaInicial",
  title: "Página Inicial",
  type: "document",
  fields: [
    defineField({
      name: "tituloHero",
      title: "Título do Banner",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtituloHero",
      title: "Subtítulo do Banner",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "imagemFundo",
      title: "Imagem de Fundo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textoCta",
      title: "Texto do Botão (CTA)",
      type: "string",
      initialValue: "Solicitar Orçamento",
    }),
    defineField({
      name: "linkCta",
      title: "Link do Botão (CTA)",
      type: "string",
      initialValue: "/orcamento",
    }),
  ],
});