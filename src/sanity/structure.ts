import type { StructureResolver } from 'sanity/structure'

const SINGLETON_TYPES = new Set(['configuracaoSite'])
const SINGLETON_DOCUMENT_ID = '5095b446-13af-40d3-a948-d3554b7b415e'

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
            .documentId(SINGLETON_DOCUMENT_ID)
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() as string)
      ),
    ])