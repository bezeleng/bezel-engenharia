import { defineField, defineType } from "sanity";

export const prospeccaoCampanha = defineType({
  name: "prospeccaoCampanha",
  title: "Prospecção — Campanha",
  type: "document",
  fields: [
    defineField({ name: "assunto", title: "Assunto", type: "string" }),
    defineField({ name: "mensagem", title: "Mensagem", type: "text", rows: 12 }),
    defineField({ name: "totalDestinatarios", title: "Destinatários", type: "number" }),
    defineField({ name: "enviados", title: "Enviados", type: "number" }),
    defineField({ name: "falhas", title: "Falhas", type: "number" }),
    defineField({ name: "bloqueados", title: "Bloqueados", type: "number" }),
    defineField({ name: "criadoEm", title: "Criada em", type: "datetime" }),
    defineField({ name: "finalizadoEm", title: "Finalizada em", type: "datetime" }),
  ],
  preview: { select: { title: "assunto", subtitle: "criadoEm" } },
});
