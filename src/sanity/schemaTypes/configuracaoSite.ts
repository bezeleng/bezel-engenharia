import { defineField, defineType } from "sanity";

export const configuracaoSite = defineType({
  name: "configuracaoSite",
  title: "Configurações do Site",
  type: "document",
  fields: [
    defineField({
      name: "nomeEmpresa",
      title: "Nome da Empresa",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "telefone",
      title: "Telefone",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (somente números, com DDI)",
      type: "string",
      description: "Ex: 5511999999999",
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "endereco",
      title: "Endereço",
      type: "text",
      rows: 3,
    }),
  ],
});