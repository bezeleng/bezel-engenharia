import { defineField, defineType } from "sanity";

export const obra = defineType({
  name: "obra",
  title: "Obra",
  type: "document",
  fieldsets: [
    {
      name: "fichaTecnica",
      title: "Ficha Técnica",
      options: { columns: 2 },
    },
  ],
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
      name: "categoria",
      title: "Categoria",
      type: "reference",
      to: [{ type: "categoria" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Em Andamento", value: "em_andamento" },
          { title: "Concluída", value: "concluida" },
        ],
        layout: "radio",
      },
      initialValue: "em_andamento",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "capa",
      title: "Imagem de Capa",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "galeria",
      title: "Galeria de Fotos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "cliente",
      title: "Cliente",
      type: "string",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "area",
      title: "Área (m²)",
      type: "number",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "ano",
      title: "Ano",
      type: "number",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "localizacao",
      title: "Localização",
      type: "string",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});