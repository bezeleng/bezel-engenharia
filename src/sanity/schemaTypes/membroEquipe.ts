// src/sanity/schemaTypes/membroEquipe.ts
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
      name: "bio",
      title: "Bio Curta",
      type: "text",
      rows: 4,
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
  ],
  orderings: [
    {
      title: "Ordem de Exibição",
      name: "ordemAsc",
      by: [{ field: "ordem", direction: "asc" }],
    },
  ],
});