import { type SchemaTypeDefinition } from 'sanity'
import { configuracaoSite } from './configuracaoSite'
import { seo } from './objects/seo'
import { servico } from './servico'
import { categoria } from './categoria'
import { projeto } from './projeto'
import { obra } from './obra'
import { membroEquipe } from './membroEquipe'
import { video } from './video'
import { galeria } from './galeria'
import { depoimento } from './depoimento'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    configuracaoSite,
    seo,
    servico,
    categoria,
    projeto,
    obra,
    membroEquipe,
    video,
    galeria,
    depoimento,
  ],
}