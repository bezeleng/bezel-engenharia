import { defineField, defineType } from "sanity";

export const prospeccaoEnvio = defineType({
  name: "prospeccaoEnvio",
  title: "Prospecção — Histórico de E-mail",
  type: "document",
  fields: [
    defineField({ name: "campanhaId", title: "Campanha", type: "string" }),
    defineField({ name: "nome", title: "Nome / Instituição", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string", validation: (r) => r.required() }),
    defineField({ name: "assunto", title: "Assunto", type: "string" }),
    defineField({ name: "status", title: "Status", type: "string" }),
    defineField({ name: "erro", title: "Erro", type: "string" }),
    defineField({ name: "teste", title: "Teste", type: "boolean" }),
    defineField({ name: "smtpMessageId", title: "SMTP Message ID", type: "string" }),
    defineField({ name: "smtpResponse", title: "Resposta SMTP", type: "string" }),
    defineField({ name: "enviadoEm", title: "Data", type: "datetime" }),
  ],
  preview: { select: { title: "email", subtitle: "status" } },
});
