import { defineField, defineType } from "sanity";

export const projeto = defineType({
  name: "projeto",
  title: "Projeto",
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
      name: "categoria",
      title: "Categoria",
      type: "reference",
      to: [{ type: "categoria" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "destaque",
      title: "Destaque",
      type: "boolean",
      initialValue: false,
      description: "Exibido no carrossel de Projetos em Destaque na Home.",
    }),
    defineField({
      name: "capa",
      title: "Imagem de Capa",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "capaAlt",
      title: "Texto alternativo da capa",
      type: "string",
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
    }),
    defineField({
      name: "galeria",
      title: "Galeria de Fotos",
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
      validation: (Rule) =>
        Rule.integer().warning("Use um ano inteiro, por exemplo 2026."),
    }),
    defineField({
      name: "localizacao",
      title: "Localização",
      type: "string",
      fieldset: "fichaTecnica",
      validation: (Rule) =>
        Rule.max(120).warning("Prefira uma localização curta e objetiva."),
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
  preview: {
    select: {
      title: "titulo",
      media: "capa",
      localizacao: "localizacao",
      ano: "ano",
    },
    prepare({ title, media, localizacao, ano }) {
      const detalhes = [localizacao, ano].filter(Boolean).join(" • ");
      return {
        title,
        subtitle: detalhes || "Projeto",
        media,
      };
    },
  },
});
