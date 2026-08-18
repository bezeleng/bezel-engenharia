// src/sanity/schemaTypes/paginaInicial.ts
import { defineField, defineType } from "sanity";

export const paginaInicial = defineType({
  name: "paginaInicial",
  title: "Página Inicial",
  type: "document",
  fields: [
    defineField({
      name: "tituloHero",
      title: "Título do Banner",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtituloHero",
      title: "Subtítulo do Banner",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "imagemFundo",
      title: "Imagem de Fundo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textoCta",
      title: "Texto do Botão (CTA)",
      type: "string",
      initialValue: "Solicitar Orçamento",
    }),
    defineField({
      name: "linkCta",
      title: "Link do Botão (CTA)",
      type: "string",
      initialValue: "/orcamento",
    }),
    defineField({
      name: "tituloCtaFinal",
      title: "Título do CTA Final",
      type: "string",
      initialValue: "Pronto para começar seu projeto?",
    }),
    defineField({
      name: "subtituloCtaFinal",
      title: "Subtítulo do CTA Final",
      type: "text",
      rows: 2,
      initialValue: "Entre em contato e transforme sua ideia em realidade.",
    }),
    defineField({
      name: "textoBotaoCtaFinal",
      title: "Texto do Botão (CTA Final)",
      type: "string",
      initialValue: "Fale Conosco",
    }),
    defineField({
      name: "linkBotaoCtaFinal",
      title: "Link do Botão (CTA Final)",
      type: "string",
      initialValue: "/contato",
    }),
        defineField({
      name: "tituloGestao",
      title: "Título da Seção de Gestão Única",
      type: "string",
      initialValue: "Uma obra. Uma única gestão.",
    }),
    defineField({
      name: "textoGestao",
      title: "Texto da Seção de Gestão Única",
      type: "text",
      rows: 3,
      initialValue:
        "Da análise inicial à entrega das chaves, a Bezel centraliza planejamento, orçamento, fornecedores, compras, mão de obra, cronograma e acompanhamento da execução.",
    }),
  ],
});