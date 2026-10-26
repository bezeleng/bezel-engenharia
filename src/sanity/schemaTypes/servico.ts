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
      validation: (Rule) => [
        Rule.required(),
        Rule.max(80).warning("Prefira títulos com até 80 caracteres."),
      ],
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
      name: "imagemDestaqueAlt",
      title: "Texto alternativo da imagem de destaque",
      type: "string",
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
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
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              validation: (Rule) =>
                Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
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
      name: "observacoesInternas",
      title: "Observações internas",
      type: "text",
      rows: 3,
      description: "Uso interno no Studio. Não é exibido publicamente.",
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
  preview: {
    select: {
      title: "titulo",
      subtitle: "descricaoCurta",
      media: "imagemDestaque",
      ordem: "ordem",
    },
    prepare({ title, subtitle, media, ordem }) {
      return {
        title,
        subtitle:
          typeof ordem === "number"
            ? `Ordem ${ordem} • ${subtitle || ""}`
            : subtitle,
        media,
      };
    },
  },
});
