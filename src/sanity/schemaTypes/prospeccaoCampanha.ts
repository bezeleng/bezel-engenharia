import { defineField, defineType } from "sanity";

export const prospeccaoCampanha = defineType({
  name: "prospeccaoCampanha",
  title: "Prospecção — Campanha",
  type: "document",
  fields: [
    defineField({
      name: "assunto",
      title: "Assunto",
      type: "string",
      validation: (Rule) =>
        Rule.max(120).warning("Prefira assuntos de e-mail mais curtos."),
    }),
    defineField({ name: "mensagem", title: "Mensagem", type: "text", rows: 12 }),
    defineField({
      name: "totalDestinatarios",
      title: "Destinatários",
      type: "number",
    }),
    defineField({ name: "enviados", title: "Enviados", type: "number" }),
    defineField({ name: "falhas", title: "Falhas", type: "number" }),
    defineField({ name: "bloqueados", title: "Bloqueados", type: "number" }),
    defineField({ name: "criadoEm", title: "Criada em", type: "datetime" }),
    defineField({ name: "finalizadoEm", title: "Finalizada em", type: "datetime" }),
  ],
  preview: {
    select: {
      title: "assunto",
      criadoEm: "criadoEm",
      total: "totalDestinatarios",
      enviados: "enviados",
      falhas: "falhas",
    },
    prepare({ title, criadoEm, total, enviados, falhas }) {
      const detalhes = [
        criadoEm,
        typeof total === "number" ? `${total} destinatários` : null,
        typeof enviados === "number" ? `${enviados} enviados` : null,
        typeof falhas === "number" && falhas > 0 ? `${falhas} falhas` : null,
      ].filter(Boolean).join(" • ");
      return {
        title: title || "Campanha sem assunto",
        subtitle: detalhes,
      };
    },
  },
});
