import { defineField, defineType } from "sanity";

export const categoria = defineType({
  name: "categoria",
  title: "Categoria",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "nome", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "nome",
      slug: "slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : "Sem slug",
      };
    },
  },
});
