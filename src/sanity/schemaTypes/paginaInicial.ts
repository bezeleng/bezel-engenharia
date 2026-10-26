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
      validation: (Rule) => [
        Rule.required(),
        Rule.max(80).warning("Prefira um título com até 80 caracteres."),
      ],
    }),
    defineField({
      name: "subtituloHero",
      title: "Subtítulo do Banner",
      type: "text",
      rows: 2,
      validation: (Rule) =>
        Rule.max(180).warning("Prefira um subtítulo com até 180 caracteres."),
    }),
    defineField({
      name: "imagemFundo",
      title: "Imagem de Fundo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagemFundoAlt",
      title: "Texto alternativo da imagem de fundo",
      type: "string",
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
    }),
    defineField({
      name: "textoCta",
      title: "Texto do Botão (CTA)",
      type: "string",
      initialValue: "Solicitar Orçamento",
      validation: (Rule) =>
        Rule.max(32).warning("CTAs curtos costumam funcionar melhor."),
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
      validation: (Rule) =>
        Rule.max(80).warning("Prefira um título com até 80 caracteres."),
    }),
    defineField({
      name: "subtituloCtaFinal",
      title: "Subtítulo do CTA Final",
      type: "text",
      rows: 2,
      initialValue: "Entre em contato e transforme sua ideia em realidade.",
      validation: (Rule) =>
        Rule.max(180).warning("Prefira um subtítulo com até 180 caracteres."),
    }),
    defineField({
      name: "textoBotaoCtaFinal",
      title: "Texto do Botão (CTA Final)",
      type: "string",
      initialValue: "Fale Conosco",
      validation: (Rule) =>
        Rule.max(32).warning("CTAs curtos costumam funcionar melhor."),
    }),
    defineField({
      name: "linkBotaoCtaFinal",
      title: "Link do Botão (CTA Final)",
      type: "string",
      initialValue: "/contato",
    }),
    defineField({
      name: "galeriaDestaques",
      title: "Galeria de Destaques da Home",
      description:
        "Adicione quantas imagens quiser. Cada item aparece com um título acima da imagem. No desktop são exibidos até 3 itens por linha.",
      type: "array",
      of: [
        {
          type: "object",
          title: "Destaque",
          fields: [
            defineField({
              name: "titulo",
              title: "Título",
              type: "string",
              description: 'Ex.: "Steel Frame"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "imagem",
              title: "Imagem",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              validation: (Rule) =>
                Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
            }),
          ],
          preview: {
            select: {
              title: "titulo",
              media: "imagem",
            },
          },
        },
      ],
    }),
    defineField({
      name: "tituloGestao",
      title: "Título da Seção de Gestão Única",
      type: "string",
      initialValue: "Uma obra. Uma única gestão.",
      validation: (Rule) =>
        Rule.max(80).warning("Prefira um título com até 80 caracteres."),
    }),
    defineField({
      name: "textoGestao",
      title: "Texto da Seção de Gestão Única",
      type: "text",
      rows: 3,
      initialValue:
        "Da análise inicial à entrega das chaves, a Bezel centraliza planejamento, orçamento, fornecedores, compras, mão de obra, cronograma e acompanhamento da execução.",
      validation: (Rule) =>
        Rule.max(320).warning("Prefira um texto mais conciso para esta seção."),
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
      title: "tituloHero",
      subtitle: "subtituloHero",
      media: "imagemFundo",
    },
  },
});
