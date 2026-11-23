import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import * as vue from 'vue'
import * as vuetifyComponents from 'vuetify/components'
import { analyzeSnippet, findUnknownSnippetImports, getSnippetTab } from '@tests/helpers/storySnippets'
import * as synapse from '@/main'
import * as stories from '../PeriodField.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

const modules = {
	'@cnamts/synapse': synapse,
	'vuetify/components': vuetifyComponents,
	'vue': vue,
}

describe('PeriodField snippets', () => {
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

	it('l\'extrait de FormValidation utilise options.validate pour la règle custom', () => {
		const script = getSnippetTab(stories.FormValidation, 'Script')
		expect(script).toContain('validate:')
		expect(script).not.toContain('validator:')
	})
})
