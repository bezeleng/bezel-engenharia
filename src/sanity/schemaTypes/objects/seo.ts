import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitulo",
      title: "Meta Título",
      type: "string",
      description: "Se vazio, usa o título da página. Ideal: até 60 caracteres.",
    }),
    defineField({
      name: "metaDescricao",
      title: "Meta Descrição",
      type: "text",
      rows: 3,
      description: "Ideal: até 160 caracteres.",
    }),
    defineField({
      name: "imagemOg",
      title: "Imagem de Compartilhamento (Open Graph)",
      type: "image",
    }),
  ],
  options: { collapsible: true, collapsed: true },
});