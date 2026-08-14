import type { StructureResolver } from 'sanity/structure'

const SINGLETON_TYPES = new Set([
  'configuracaoSite',
  'paginaInicial',
  'paginaSobre',
  'politicaPrivacidade',
])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Configurações do Site')
        .id('configuracaoSite')
        .child(
          S.document()
            .schemaType('configuracaoSite')
            .documentId('5095b446-13af-40d3-a948-d3554b7b415e')
        ),
      S.listItem()
        .title('Página Inicial')
        .id('paginaInicial')
        .child(
          S.document().schemaType('paginaInicial').documentId('paginaInicial')
        ),
      S.listItem()
        .title('Página Sobre')
        .id('paginaSobre')
        .child(
          S.document().schemaType('paginaSobre').documentId('paginaSobre')
        ),
      S.listItem()
        .title('Política de Privacidade')
        .id('politicaPrivacidade')
        .child(
          S.document()
            .schemaType('politicaPrivacidade')
            .documentId('politicaPrivacidade')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() as string)
      ),
    ])