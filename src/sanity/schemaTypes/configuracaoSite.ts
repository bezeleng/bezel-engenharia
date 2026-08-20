// src/sanity/schemaTypes/configuracaoSite.ts
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
      name: "mensagemWhatsapp",
      title: "Mensagem Inicial do WhatsApp",
      type: "text",
      rows: 3,
      initialValue:
        "Olá! Vim pelo site da BEZEL e gostaria de conversar sobre meu projeto.",
      description: "Texto que já vem preenchido ao abrir a conversa.",
    }),
    defineField({
      name: "email",
      title: "E-mail",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "endereco",
      title: "Endereço (texto livre)",
      type: "text",
      rows: 3,
      description:
        "Usado como exibição simples. Para o mapa e dados estruturados, preencha também os campos estruturados abaixo.",
    }),
    defineField({
      name: "logradouro",
      title: "Logradouro",
      type: "string",
      description: 'Ex: "Rua Targino Emygdio dos Santos, 140"',
    }),
    defineField({
      name: "cidade",
      title: "Cidade",
      type: "string",
      initialValue: "Jacareí",
    }),
    defineField({
      name: "estado",
      title: "Estado (UF)",
      type: "string",
      initialValue: "SP",
    }),
    defineField({
      name: "cep",
      title: "CEP",
      type: "string",
    }),
    defineField({
      name: "cnpj",
      title: "CNPJ",
      type: "string",
    }),
    defineField({
      name: "regiaoAtendimento",
      title: "Região de Atendimento",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Jacareí", "São José dos Campos", "Vale do Paraíba"],
    }),
    defineField({
      name: "linkAvaliacoesGoogle",
      title: "Link do Perfil no Google (avaliações)",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram (URL completa)",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook (URL completa)",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "youtubeUrl",
      title: "YouTube (URL completa)",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
});