import { defineField, defineType } from "sanity";

export const membroEquipe = defineType({
  name: "membroEquipe",
  title: "Membro da Equipe",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cargo",
      title: "Cargo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "fotoAlt",
      title: "Texto alternativo da foto",
      type: "string",
      description:
        "Descrição curta da foto para acessibilidade e organização editorial.",
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
    }),
    defineField({
      name: "bio",
      title: "Bio Curta",
      type: "text",
      rows: 4,
      validation: (Rule) =>
        Rule.max(320).warning("Uma bio curta costuma funcionar melhor com até 320 caracteres."),
    }),
    defineField({
      name: "redesSociais",
      title: "Redes Sociais",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "rede",
              title: "Rede",
              type: "string",
              options: {
                list: [
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Instagram", value: "instagram" },
                ],
              },
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "ordem",
      title: "Ordem de Exibição",
      type: "number",
    }),
    defineField({
      name: "observacoesInternas",
      title: "Observações internas",
      type: "text",
      rows: 3,
      description: "Uso interno no Studio. Não é exibido publicamente.",
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
      title: "nome",
      subtitle: "cargo",
      media: "foto",
    },
  },
});
