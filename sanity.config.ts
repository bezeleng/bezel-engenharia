'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

const SINGLETON_TYPES = new Set(['configuracaoSite', 'paginaInicial'])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (template) => !SINGLETON_TYPES.has(template.templateId)
        )
      }
      return prev
    },
  },
})