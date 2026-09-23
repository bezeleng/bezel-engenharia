import { defineField, defineType } from "sanity";

export const servico = defineType({
  name: "servico",
  title: "Serviço",
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icone",
      title: "Ícone",
      type: "image",
    }),
    defineField({
      name: "imagemDestaque",
      title: "Imagem de Destaque",
      type: "image",
      options: { hotspot: true },
      description:
        "Imagem principal exibida na página individual do serviço, logo abaixo do título.",
    }),
    defineField({
      name: "galeria",
      title: "Galeria de Imagens",
      type: "array",
      description:
        "Adicione uma ou mais imagens para complementar a apresentação deste serviço.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "legenda",
              title: "Legenda",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "descricaoCurta",
      title: "Descrição Curta",
      type: "text",
      rows: 3,
      description: "Usada em cards e listagens.",
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "descricaoLonga",
      title: "Descrição Completa",
      type: "array",
      of: [{ type: "block" }],
      description: "Usada na página individual do serviço.",
    }),
    defineField({
      name: "ordem",
      title: "Ordem de Exibição",
      type: "number",
      description: "Menor número aparece primeiro.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  orderings: [
    {
      title: "Ordem de Exibição",
      name: "ordemAsc",
      by: [{ field: "ordem", direction: "asc" }],
    },
  ],
});