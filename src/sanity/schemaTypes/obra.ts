// src/sanity/schemaTypes/obra.ts
import { defineField, defineType } from "sanity";

export const obra = defineType({
  name: "obra",
  title: "Obra",
  type: "document",
  fieldsets: [
    {
      name: "fichaTecnica",
      title: "Ficha Técnica",
      options: { columns: 2 },
    },
    {
      name: "datas",
      title: "Datas e Prazo",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "titulo", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "reference",
      to: [{ type: "categoria" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tipoObra",
      title: "Tipo de Obra",
      type: "string",
      options: {
        list: [
          { title: "Construção Nova", value: "construcao_nova" },
          { title: "Reforma", value: "reforma" },
          { title: "Ampliação", value: "ampliacao" },
          { title: "Retrofit", value: "retrofit" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Em Andamento", value: "em_andamento" },
          { title: "Concluída", value: "concluida" },
        ],
        layout: "radio",
      },
      initialValue: "em_andamento",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "servicosRealizados",
      title: "Serviços Realizados pela BEZEL",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Gerenciamento de Obras", value: "gerenciamento_de_obras" },
          { title: "Execução da Obra", value: "execucao_da_obra" },
          { title: "Planejamento", value: "planejamento" },
          { title: "Orçamento", value: "orcamento" },
          { title: "Estudo de Viabilidade", value: "estudo_de_viabilidade" },
          {
            title: "Gestão de Compras e Fornecedores",
            value: "gestao_de_compras_e_fornecedores",
          },
          {
            title: "Acompanhamento Técnico",
            value: "acompanhamento_tecnico",
          },
          {
            title: "Projeto Arquitetônico",
            value: "projeto_arquitetonico",
          },
          { title: "Projeto de Engenharia", value: "projeto_de_engenharia" },
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "capa",
      title: "Imagem de Capa",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "galeria",
      title: "Galeria de Fotos",
      type: "array",
      of: [
        {
          type: "object",
          name: "itemGaleria",
          title: "Imagem",
          fields: [
            defineField({
              name: "imagem",
              title: "Imagem",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "legenda",
              title: "Legenda",
              type: "string",
            }),
            defineField({
              name: "etapa",
              title: "Etapa",
              type: "string",
              options: {
                list: [
                  { title: "Antes", value: "antes" },
                  { title: "Durante", value: "durante" },
                  { title: "Depois", value: "depois" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "ordem",
              title: "Ordem de Exibição",
              type: "number",
            }),
          ],
          preview: {
            select: {
              title: "legenda",
              subtitle: "etapa",
              media: "imagem",
            },
          },
        },
      ],
    }),
    defineField({
      name: "descricao",
      title: "Descrição (Sobre a Obra)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "desafioObra",
      title: "O Desafio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "solucaoBezel",
      title: "Nossa Solução",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "principaisServicos",
      title: "Principais Serviços Executados",
      type: "array",
      of: [{ type: "string" }],
      description: "Lista livre, um item por linha.",
    }),
    defineField({
      name: "resultadosDestaques",
      title: "Resultados / Destaques",
      type: "array",
      of: [{ type: "string" }],
      description: "Lista livre, um item por linha.",
    }),
    defineField({
      name: "cliente",
      title: "Cliente",
      type: "string",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "exibirClientePublicamente",
      title: "Exibir cliente publicamente?",
      type: "boolean",
      initialValue: false,
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "area",
      title: "Área (m²)",
      type: "number",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "metragemTerreno",
      title: "Metragem do Terreno (m²)",
      type: "number",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "metragemConstruida",
      title: "Metragem Construída (m²)",
      type: "number",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "ano",
      title: "Ano",
      type: "number",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "localizacao",
      title: "Localização",
      type: "string",
      fieldset: "fichaTecnica",
    }),
    defineField({
      name: "dataInicio",
      title: "Data de Início",
      type: "date",
      fieldset: "datas",
    }),
    defineField({
      name: "dataConclusao",
      title: "Data de Conclusão",
      type: "date",
      fieldset: "datas",
      hidden: ({ parent }) => parent?.status !== "concluida",
    }),
    defineField({
      name: "previsaoConclusao",
      title: "Previsão de Conclusão",
      type: "date",
      fieldset: "datas",
      hidden: ({ parent }) => parent?.status !== "em_andamento",
    }),
    defineField({
      name: "prazoObra",
      title: "Prazo da Obra",
      type: "string",
      description: 'Ex: "12 meses"',
      fieldset: "datas",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
});