import { defineField, defineType } from "sanity";

export const prospeccaoContato = defineType({
  name: "prospeccaoContato",
  title: "Prospecção — Contato",
  type: "document",
  fields: [
    defineField({ name: "nome", title: "Nome / Empresa / Instituição", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "cidade", title: "Cidade", type: "string" }),
    defineField({ name: "segmento", title: "Segmento", type: "string" }),
    defineField({ name: "telefone", title: "Telefone", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp confirmado", type: "string" }),
    defineField({ name: "site", title: "Site", type: "url" }),
    defineField({ name: "instagram", title: "Instagram", type: "url" }),
    defineField({ name: "origem", title: "Origem", type: "string" }),
    defineField({ name: "pesquisaHunter", title: "Pesquisa Hunter", type: "string" }),
    defineField({ name: "fonteUrl", title: "Fonte", type: "string" }),
    defineField({ name: "dominio", title: "Domínio", type: "string" }),
    defineField({ name: "encontradoEm", title: "Encontrado em", type: "datetime" }),
    defineField({
      name: "status", title: "Status", type: "string", initialValue: "NOVO",
      options: { list: [
        { title: "Novo", value: "NOVO" }, { title: "Contatado", value: "CONTATADO" },
        { title: "Respondeu", value: "RESPONDEU" }, { title: "Visita", value: "VISITA" },
        { title: "Proposta", value: "PROPOSTA" }, { title: "Negociação", value: "NEGOCIACAO" },
        { title: "Cliente", value: "CLIENTE" }, { title: "Arquivado", value: "ARQUIVADO" },
      ]},
    }),
    defineField({ name: "optOut", title: "Não enviar novos e-mails", type: "boolean", initialValue: false }),
    defineField({ name: "ultimoContatoEm", title: "Último contato", type: "datetime" }),
    defineField({ name: "proximoFollowUpEm", title: "Próximo follow-up", type: "datetime" }),
    defineField({ name: "observacoes", title: "Observações", type: "text", rows: 4 }),
  ],
  preview: { select: { title: "nome", subtitle: "email" } },
});
