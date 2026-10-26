import { defineField, defineType } from "sanity";

export const paginaSobre = defineType({
  name: "paginaSobre",
  title: "Página Sobre",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      initialValue: "Sobre a BEZEL",
      validation: (Rule) => [
        Rule.required(),
        Rule.max(80).warning("Prefira um título com até 80 caracteres."),
      ],
    }),
    defineField({
      name: "textoIntroducao",
      title: "Texto de Introdução",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "imagemDestaque",
      title: "Imagem de Destaque",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imagemDestaqueAlt",
      title: "Texto alternativo da imagem de destaque",
      type: "string",
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
    }),
    defineField({
      name: "missao",
      title: "Missão",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(320).warning("Prefira uma missão curta e objetiva."),
    }),
    defineField({
      name: "visao",
      title: "Visão",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(320).warning("Prefira uma visão curta e objetiva."),
    }),
    defineField({
      name: "valores",
      title: "Valores",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tituloDiferenciais",
      title: "Título - Por que escolher a Bezel",
      type: "string",
      initialValue: "Por que escolher a Bezel?",
      validation: (Rule) =>
        Rule.max(80).warning("Prefira um título com até 80 caracteres."),
    }),
    defineField({
      name: "subtituloDiferenciais",
      title: "Subtítulo - Por que escolher a Bezel",
      type: "string",
      initialValue: "Construímos com método, não com improviso.",
      validation: (Rule) =>
        Rule.max(120).warning("Prefira um subtítulo mais curto."),
    }),
    defineField({
      name: "textoDiferenciais",
      title: "Texto - Por que escolher a Bezel",
      type: "text",
      rows: 4,
      initialValue:
        "Cada obra é conduzida a partir de planejamento, orçamento, cronograma e acompanhamento contínuo. Centralizamos profissionais, fornecedores, compras e execução para proporcionar ao cliente mais controle e menos preocupações durante todo o processo.",
      validation: (Rule) =>
        Rule.max(480).warning("Prefira um texto mais conciso para esta seção."),
    }),
    defineField({
      name: "diferenciais",
      title: "Diferenciais (4 itens)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string" }),
            defineField({
              name: "descricao",
              title: "Descrição",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "titulo", subtitle: "descricao" },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: "mostrarEquipe",
      title: "Mostrar seção de equipe nesta página?",
      type: "boolean",
      initialValue: true,
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
      media: "imagemDestaque",
      mostrarEquipe: "mostrarEquipe",
    },
    prepare({ title, media, mostrarEquipe }) {
      return {
        title,
        subtitle: mostrarEquipe === false ? "Equipe oculta" : "Equipe visível",
        media,
      };
    },
  },
});
