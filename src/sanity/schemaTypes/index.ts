import { type SchemaTypeDefinition } from 'sanity'
import { configuracaoSite } from './configuracaoSite'
import { paginaInicial } from './paginaInicial'
import { paginaSobre } from './paginaSobre'
import { paginaSistema } from './paginaSistema'
import { politicaPrivacidade } from './politicaPrivacidade'
import { seo } from './objects/seo'
import { servico } from './servico'
import { categoria } from './categoria'
import { projeto } from './projeto'
import { obra } from './obra'
import { membroEquipe } from './membroEquipe'
import { video } from './video'
import { categoriaVideo } from './categoriaVideo'
import { galeria } from './galeria'
import { depoimento } from './depoimento'
import { prospeccaoContato } from './prospeccaoContato'
import { prospeccaoEnvio } from './prospeccaoEnvio'
import { prospeccaoCampanha } from './prospeccaoCampanha'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    configuracaoSite,
    paginaInicial,
    paginaSobre,
    paginaSistema,
    politicaPrivacidade,
    seo,
    servico,
    categoria,
    projeto,
    obra,
    membroEquipe,
    categoriaVideo,
    video,
    galeria,
    depoimento,
    prospeccaoContato,
    prospeccaoEnvio,
    prospeccaoCampanha,
  ],
}
