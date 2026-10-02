import { defineField, defineType } from "sanity";

export const paginaSistema = defineType({
  name: "paginaSistema",
  title: "Landing BEZEL Gestão",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "bel", title: "BEL" },
    { name: "conteudo", title: "Conteúdo" },
    { name: "planos", title: "Planos" },
    { name: "mobile", title: "Mobile" },
    { name: "faq", title: "FAQ" },
    { name: "cta", title: "CTA final" },
    { name: "seo", title: "SEO" },
  ],
  initialValue: {
    badgeHero: "BEZEL Gestão · Software para gestão de obras",
    tituloHero: "A obra gera dados todos os dias. Transforme isso em gestão.",
    subtituloHero:
      "Planejamento, execução, compras, financeiro, documentos e comercial em um ambiente criado para quem vive a obra — com a BEL, a gestora inteligente da BEZEL, evoluindo junto à operação.",
    textoCtaPrimario: "Conhecer a BEZEL",
    linkCtaPrimario: "#como-funciona",
    textoCtaSecundario: "Falar com a equipe",
    linkCtaSecundario: "/contato",
    belTitulo: "Prazer, eu sou a BEL.",
    belSubtitulo: "A gestora inteligente da BEZEL Gestão.",
    belDescricao:
      "A BEL foi criada para trabalhar com o contexto real da operação — fatos do sistema, histórico da obra e conhecimento técnico estruturado — ajudando a transformar informação espalhada em sinais mais úteis para gestão.",
    belStatus: "Em evolução",
    belAviso:
      "A BEL está em evolução. Recursos do Radar e outras experiências inteligentes só são apresentados como disponíveis quando estiverem efetivamente liberados no produto.",
    tituloProblema: "É quando cada parte da obra vive em um lugar diferente.",
    textoProblema:
      "Mensagens no WhatsApp, planilhas isoladas, papel, arquivos espalhados, compras sem histórico e decisões financeiras sem a mesma visão da execução. A BEZEL foi desenhada para aproximar essas informações sem transformar a rotina em burocracia.",
    tituloModulos: "A BEZEL acompanha a obra antes, durante e depois da execução.",
    textoModulos:
      "Em vez de criar ilhas de informação, o produto organiza módulos diferentes ao redor da mesma operação.",
    tituloFluxo: "A informação acompanha a obra. Não fica presa em um módulo.",
    textoFluxo:
      "O valor da BEZEL está menos em ter muitas telas e mais em organizar etapas diferentes dentro de uma mesma operação, preservando contexto e histórico.",
    tituloDiferenciais:
      "Tecnologia suficiente para organizar. Sem transformar a obra em ERP antigo.",
    tituloMobile: "BEZEL onde a obra acontece.",
    textoMobile:
      "A experiência web já se adapta a telas menores. O aplicativo nativo está em desenvolvimento e esta seção ficará pronta para receber os links oficiais da Google Play e da App Store quando eles existirem.",
    statusMobile: "Aplicativo em desenvolvimento",
    tituloPlanos: "Uma estrutura preparada para crescer com a operação.",
    textoPlanos:
      "START, PRO e BUSINESS já fazem parte da estrutura comercial do produto. Preços, limites e composição final de recursos ainda serão publicados.",
    tituloFaq: "Entenda o produto antes de levar mais um sistema para a obra.",
    tituloCtaFinal:
      "Sua obra já produz dados todos os dias. A BEZEL organiza esses dados para você enxergar melhor a operação.",
    textoCtaFinal:
      "Conheça o produto, acompanhe a evolução da BEL e converse com a equipe sobre a entrada da BEZEL na sua rotina.",
    textoBotaoCtaFinal: "Falar sobre a BEZEL Gestão",
    linkBotaoCtaFinal: "/contato",
  },
  fields: [
    defineField({
      name: "badgeHero",
      title: "Selo acima do título",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "tituloHero",
      title: "Título principal",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtituloHero",
      title: "Texto do Hero",
      type: "text",
      rows: 4,
      group: "hero",
    }),
    defineField({
      name: "textoCtaPrimario",
      title: "Texto do botão principal",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "linkCtaPrimario",
      title: "Link do botão principal",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "textoCtaSecundario",
      title: "Texto do botão secundário",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "linkCtaSecundario",
      title: "Link do botão secundário",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroDestaques",
      title: "Destaques rápidos do Hero",
      description: "Ex.: Integrado / Dados por obra.",
      type: "array",
      group: "hero",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string" }),
            defineField({ name: "descricao", title: "Descrição", type: "string" }),
          ],
          preview: { select: { title: "titulo", subtitle: "descricao" } },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    defineField({
      name: "belImagem",
      title: "Foto / mascote da BEL",
      description: "Envie aqui a imagem que deve aparecer em destaque na landing.",
      type: "image",
      options: { hotspot: true },
      group: "bel",
    }),
    defineField({
      name: "belTitulo",
      title: "Título",
      type: "string",
      group: "bel",
    }),
    defineField({
      name: "belSubtitulo",
      title: "Subtítulo",
      type: "string",
      group: "bel",
    }),
    defineField({
      name: "belDescricao",
      title: "Descrição",
      type: "text",
      rows: 5,
      group: "bel",
    }),
    defineField({
      name: "belStatus",
      title: "Status",
      description: 'Ex.: "Em evolução", "Disponível", "Beta".',
      type: "string",
      group: "bel",
    }),
    defineField({
      name: "belPilares",
      title: "Pilares / recursos da BEL",
      type: "array",
      group: "bel",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string" }),
            defineField({ name: "descricao", title: "Descrição", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "titulo", subtitle: "descricao" } },
        },
      ],
    }),
    defineField({
      name: "belPerguntas",
      title: "Exemplos de perguntas para a BEL",
      type: "array",
      group: "bel",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "belAviso",
      title: "Aviso / observação sobre disponibilidade",
      type: "text",
      rows: 3,
      group: "bel",
    }),

    defineField({
      name: "tituloProblema",
      title: "Título da seção Problema",
      type: "string",
      group: "conteudo",
    }),
    defineField({
      name: "textoProblema",
      title: "Texto da seção Problema",
      type: "text",
      rows: 4,
      group: "conteudo",
    }),
    defineField({
      name: "tituloModulos",
      title: "Título da seção Módulos",
      type: "string",
      group: "conteudo",
    }),
    defineField({
      name: "textoModulos",
      title: "Texto da seção Módulos",
      type: "text",
      rows: 3,
      group: "conteudo",
    }),
    defineField({
      name: "modulos",
      title: "Módulos",
      type: "array",
      group: "conteudo",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "numero", title: "Número", type: "string" }),
            defineField({ name: "titulo", title: "Título", type: "string" }),
            defineField({ name: "descricao", title: "Descrição", type: "text", rows: 3 }),
            defineField({ name: "itens", title: "Itens", type: "array", of: [{ type: "string" }] }),
          ],
          preview: {
            select: { title: "titulo", subtitle: "descricao" },
          },
        },
      ],
    }),
    defineField({
      name: "tituloFluxo",
      title: "Título da seção Fluxo",
      type: "string",
      group: "conteudo",
    }),
    defineField({
      name: "textoFluxo",
      title: "Texto da seção Fluxo",
      type: "text",
      rows: 3,
      group: "conteudo",
    }),
    defineField({
      name: "fluxo",
      title: "Etapas do fluxo",
      type: "array",
      group: "conteudo",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "tituloDiferenciais",
      title: "Título da seção Diferenciais",
      type: "string",
      group: "conteudo",
    }),
    defineField({
      name: "diferenciais",
      title: "Diferenciais",
      type: "array",
      group: "conteudo",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string" }),
            defineField({ name: "descricao", title: "Descrição", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "titulo", subtitle: "descricao" } },
        },
      ],
    }),

    defineField({
      name: "tituloPlanos",
      title: "Título da seção Planos",
      type: "string",
      group: "planos",
    }),
    defineField({
      name: "textoPlanos",
      title: "Texto da seção Planos",
      type: "text",
      rows: 3,
      group: "planos",
    }),
    defineField({
      name: "planos",
      title: "Planos",
      description: "Edite preço, descrição, recursos e botão de cada plano.",
      type: "array",
      group: "planos",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "nome", title: "Nome do plano", type: "string" }),
            defineField({ name: "publico", title: "Descrição / público", type: "text", rows: 2 }),
            defineField({
              name: "preco",
              title: "Preço exibido",
              description: 'Aceita texto livre, ex.: "R$ 99/mês", "Sob consulta" ou "Preço em breve".',
              type: "string",
            }),
            defineField({ name: "observacaoPreco", title: "Observação do preço", type: "string" }),
            defineField({ name: "recursos", title: "Recursos incluídos", type: "array", of: [{ type: "string" }] }),
            defineField({ name: "destaque", title: "Destacar este plano?", type: "boolean", initialValue: false }),
            defineField({ name: "textoBotao", title: "Texto do botão", type: "string" }),
            defineField({ name: "linkBotao", title: "Link do botão", type: "string" }),
          ],
          preview: {
            select: { title: "nome", subtitle: "preco" },
          },
        },
      ],
    }),

    defineField({
      name: "tituloMobile",
      title: "Título",
      type: "string",
      group: "mobile",
    }),
    defineField({
      name: "textoMobile",
      title: "Texto",
      type: "text",
      rows: 4,
      group: "mobile",
    }),
    defineField({
      name: "statusMobile",
      title: "Status do aplicativo",
      type: "string",
      group: "mobile",
    }),
    defineField({
      name: "googlePlayUrl",
      title: "URL Google Play",
      type: "url",
      group: "mobile",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "appStoreUrl",
      title: "URL App Store",
      type: "url",
      group: "mobile",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),

    defineField({
      name: "tituloFaq",
      title: "Título da FAQ",
      type: "string",
      group: "faq",
    }),
    defineField({
      name: "faqs",
      title: "Perguntas e respostas",
      type: "array",
      group: "faq",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "pergunta", title: "Pergunta", type: "string" }),
            defineField({ name: "resposta", title: "Resposta", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "pergunta", subtitle: "resposta" } },
        },
      ],
    }),

    defineField({
      name: "tituloCtaFinal",
      title: "Título",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "textoCtaFinal",
      title: "Texto",
      type: "text",
      rows: 3,
      group: "cta",
    }),
    defineField({
      name: "textoBotaoCtaFinal",
      title: "Texto do botão",
      type: "string",
      group: "cta",
    }),
    defineField({
      name: "linkBotaoCtaFinal",
      title: "Link do botão",
      type: "string",
      group: "cta",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
});
