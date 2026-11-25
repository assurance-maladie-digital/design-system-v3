import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import * as vue from 'vue'
import * as vuetify from 'vuetify'
import * as vuetifyComponents from 'vuetify/components'
import * as mdi from '@mdi/js'
import { analyzeSnippet, findUnknownSnippetImports } from '@tests/helpers/storySnippets'
import * as synapse from '@/main'
import * as stories from '../FooterBar.stories'
import documentation from '../FooterBar.mdx?raw'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

const usageExamples = [...documentation.matchAll(/<Source\b[^>]*?\bcode=\{`([\s\S]*?)`\}/g)].map(([, code], index) => ({
	index: index + 1,
	example: { parameters: { sourceCode: [{ code: code! }] } },
}))

const modules = {
	'@cnamts/synapse': synapse,
	'vuetify': vuetify,
	'vuetify/components': vuetifyComponents,
	'vue': vue,
	'@mdi/js': mdi,
}

describe('FooterBar snippets', () => {
	it.each(allStories)('l\'extrait de $name est un SFC autonome et copiable', ({ story }) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each(allStories)('l\'extrait de $name n\'importe que des exports réellement disponibles', ({ story }) => {
		expect(findUnknownSnippetImports(story, modules)).toEqual([])
	})

	it('trouve les exemples de code de la documentation', () => {
		expect(usageExamples.length).toBeGreaterThan(0)
	})

	it.each(usageExamples)('l\'exemple n°$index de la documentation est un SFC autonome et copiable', ({ example }) => {
		expect(analyzeSnippet(example)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each(usageExamples)('l\'exemple n°$index de la documentation n\'importe que des exports réellement disponibles', ({ example }) => {
		expect(findUnknownSnippetImports(example, modules)).toEqual([])
	})
})
