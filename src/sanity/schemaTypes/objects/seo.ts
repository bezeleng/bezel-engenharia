import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitulo",
      title: "Meta Título",
      type: "string",
      description: "Se vazio, usa o título da página. Recomendado: até 60 caracteres.",
      validation: (Rule) =>
        Rule.max(60).warning("Recomendamos até 60 caracteres para evitar cortes no Google."),
    }),
    defineField({
      name: "metaDescricao",
      title: "Meta Descrição",
      type: "text",
      rows: 3,
      description: "Recomendado: até 160 caracteres.",
      validation: (Rule) =>
        Rule.max(160).warning("Recomendamos até 160 caracteres para evitar cortes no Google."),
    }),
    defineField({
      name: "palavraChavePrincipal",
      title: "Palavra-chave principal",
      type: "string",
      description:
        "Campo editorial para orientar o conteúdo. Não altera o Google automaticamente.",
    }),
    defineField({
      name: "imagemOg",
      title: "Imagem de Compartilhamento (Open Graph)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imagemOgAlt",
      title: "Texto alternativo da imagem de compartilhamento",
      type: "string",
      description:
        "Descrição curta da imagem para acessibilidade e organização editorial.",
      validation: (Rule) =>
        Rule.max(140).warning("Prefira um texto alternativo curto e objetivo."),
    }),
    defineField({
      name: "observacoesSeo",
      title: "Observações internas de SEO",
      type: "text",
      rows: 3,
      description:
        "Uso interno no Studio. Este texto não é exibido publicamente no site.",
    }),
  ],
  options: { collapsible: true, collapsed: true },
});
