import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('BEZEL Studio')
    .items([
      S.listItem()
        .title('Site')
        .child(
          S.list()
            .title('Site')
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
                  S.document()
                    .schemaType('paginaInicial')
                    .documentId('paginaInicial')
                ),
              S.listItem()
                .title('Página Sobre')
                .id('paginaSobre')
                .child(
                  S.document()
                    .schemaType('paginaSobre')
                    .documentId('paginaSobre')
                ),
              S.listItem()
                .title('Política de Privacidade')
                .id('politicaPrivacidade')
                .child(
                  S.document()
                    .schemaType('politicaPrivacidade')
                    .documentId('politicaPrivacidade')
                ),
            ])
        ),

      S.listItem()
        .title('Serviços e Portfólio')
        .child(
          S.list()
            .title('Serviços e Portfólio')
            .items([
              S.listItem()
                .title('Serviços')
                .child(S.documentTypeList('servico').title('Serviços')),
              S.listItem()
                .title('Projetos')
                .child(S.documentTypeList('projeto').title('Projetos')),
              S.listItem()
                .title('Obras')
                .child(S.documentTypeList('obra').title('Obras')),
              S.listItem()
                .title('Categorias')
                .child(S.documentTypeList('categoria').title('Categorias')),
            ])
        ),

      S.listItem()
        .title('Conteúdo e Prova Social')
        .child(
          S.list()
            .title('Conteúdo e Prova Social')
            .items([
              S.listItem()
                .title('Vídeos')
                .child(S.documentTypeList('video').title('Vídeos')),
              S.listItem()
                .title('Categorias de Vídeo')
                .child(
                  S.documentTypeList('categoriaVideo').title('Categorias de Vídeo')
                ),
              S.listItem()
                .title('Galerias')
                .child(S.documentTypeList('galeria').title('Galerias')),
              S.listItem()
                .title('Depoimentos')
                .child(S.documentTypeList('depoimento').title('Depoimentos')),
              S.listItem()
                .title('Equipe')
                .child(S.documentTypeList('membroEquipe').title('Equipe')),
            ])
        ),

      S.listItem()
        .title('BEZEL Gestão')
        .id('paginaSistema')
        .child(
          S.document()
            .schemaType('paginaSistema')
            .documentId('paginaSistema')
        ),

      S.listItem()
        .title('Marketing e CRM')
        .child(
          S.list()
            .title('Marketing e CRM')
            .items([
              S.listItem()
                .title('Contatos de Prospecção')
                .child(
                  S.documentTypeList('prospeccaoContato').title(
                    'Contatos de Prospecção'
                  )
                ),
              S.listItem()
                .title('Campanhas')
                .child(
                  S.documentTypeList('prospeccaoCampanha').title('Campanhas')
                ),
              S.listItem()
                .title('Envios')
                .child(
                  S.documentTypeList('prospeccaoEnvio').title('Envios')
                ),
            ])
        ),
    ])
