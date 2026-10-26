import { defineField, defineType } from "sanity";

export const galeria = defineType({
  name: "galeria",
  title: "Galeria",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagens",
      title: "Imagens",
      type: "array",
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
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "observacoesInternas",
      title: "Observações internas",
      type: "text",
      rows: 3,
      description: "Uso interno no Studio. Não é exibido publicamente.",
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      imagens: "imagens",
      media: "imagens.0",
    },
    prepare({ title, imagens, media }) {
      const quantidade = Array.isArray(imagens) ? imagens.length : 0;
      return {
        title,
        subtitle: `${quantidade} ${quantidade === 1 ? "imagem" : "imagens"}`,
        media,
      };
    },
  },
});
