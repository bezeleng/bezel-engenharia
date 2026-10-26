import { defineField, defineType } from "sanity";

export const depoimento = defineType({
  name: "depoimento",
  title: "Depoimento",
  type: "document",
  fields: [
    defineField({
      name: "nomeCliente",
      title: "Nome do Cliente",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cargoEmpresa",
      title: "Cargo / Empresa",
      type: "string",
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
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
    }),
    defineField({
      name: "texto",
      title: "Depoimento",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "nota",
      title: "Nota (1 a 5)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: "origem",
      title: "Origem do depoimento",
      type: "string",
      options: {
        list: [
          { title: "Google", value: "google" },
          { title: "Cliente direto", value: "cliente_direto" },
          { title: "Outro", value: "outro" },
        ],
      },
      description: "Campo editorial opcional para identificar a origem.",
    }),
    defineField({
      name: "urlOrigem",
      title: "Link da avaliação / origem",
      type: "url",
      description: "Opcional. Use quando houver uma página pública da avaliação.",
    }),
    defineField({
      name: "dataDepoimento",
      title: "Data do depoimento",
      type: "date",
    }),
    defineField({
      name: "tipoServico",
      title: "Tipo de Serviço",
      type: "reference",
      to: [{ type: "servico" }],
    }),
    defineField({
      name: "obraRelacionada",
      title: "Obra Relacionada",
      type: "reference",
      to: [{ type: "obra" }],
    }),
    defineField({
      name: "destaque",
      title: "Destaque",
      type: "boolean",
      initialValue: false,
      description: "Exibido na Home quando marcado.",
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
      title: "nomeCliente",
      subtitle: "cargoEmpresa",
      media: "foto",
      nota: "nota",
      destaque: "destaque",
    },
    prepare({ title, subtitle, media, nota, destaque }) {
      const detalhes = [
        destaque ? "Destaque" : null,
        nota ? `${nota}/5` : null,
        subtitle,
      ].filter(Boolean).join(" • ");
      return { title, subtitle: detalhes || "Depoimento", media };
    },
  },
});
