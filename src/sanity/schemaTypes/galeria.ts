// src/sanity/schemaTypes/galeria.ts
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
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});