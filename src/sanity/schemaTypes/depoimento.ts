// src/sanity/schemaTypes/depoimento.ts
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
  ],
});