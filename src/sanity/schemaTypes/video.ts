import { defineField, defineType } from "sanity";

export const video = defineType({
  name: "video",
  title: "Vídeo",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => [
        Rule.required(),
        Rule.max(100).warning("Prefira títulos com até 100 caracteres."),
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "titulo", maxLength: 96 },
    }),
    defineField({
      name: "url",
      title: "URL do Vídeo (YouTube ou Vimeo)",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "reference",
      to: [{ type: "categoriaVideo" }],
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Personalizada",
      type: "image",
      options: { hotspot: true },
      description:
        "Opcional. Para YouTube, se vazio, usamos a miniatura automática da plataforma. Para Vimeo, recomendamos sempre enviar uma thumbnail.",
    }),
    defineField({
      name: "thumbnailAlt",
      title: "Texto alternativo da thumbnail",
      type: "string",
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
    }),
    defineField({
      name: "descricaoCurta",
      title: "Descrição Curta",
      type: "text",
      rows: 2,
      description: "Usada no card da grade de vídeos.",
      validation: (Rule) =>
        Rule.max(180).warning("Prefira uma descrição curta com até 180 caracteres."),
    }),
    defineField({
      name: "descricaoCompleta",
      title: "Descrição Completa",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "dataPublicacao",
      title: "Data de Publicação",
      type: "date",
    }),
    defineField({
      name: "duracao",
      title: "Duração",
      type: "string",
      description: 'Ex: "12:34" ou "15 min".',
    }),
    defineField({
      name: "destaque",
      title: "Vídeo em Destaque",
      type: "boolean",
      initialValue: false,
      description: "Aparece em card maior no topo da página de Vídeos.",
    }),
    defineField({
      name: "obraRelacionada",
      title: "Obra Relacionada",
      type: "reference",
      to: [{ type: "obra" }],
      description: "Preparado para uso futuro — ainda não exibido em Obras.",
    }),
    defineField({
      name: "servicoRelacionado",
      title: "Serviço Relacionado",
      type: "reference",
      to: [{ type: "servico" }],
      description: "Preparado para uso futuro — ainda não exibido em Serviços.",
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
      media: "thumbnail",
      data: "dataPublicacao",
      duracao: "duracao",
      destaque: "destaque",
    },
    prepare({ title, media, data, duracao, destaque }) {
      const detalhes = [
        destaque ? "Destaque" : null,
        data,
        duracao,
      ].filter(Boolean).join(" • ");
      return {
        title,
        subtitle: detalhes || "Vídeo",
        media,
      };
    },
  },
});
