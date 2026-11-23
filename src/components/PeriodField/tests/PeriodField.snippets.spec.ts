import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, findUnknownSnippetImports, getSnippetTab } from '@tests/helpers/storySnippets'
import * as stories from '../PeriodField.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

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
		expect(findUnknownSnippetImports(story)).toEqual([])
	})

	it('l\'extrait de FormValidation utilise options.validate pour la règle custom', () => {
		const script = getSnippetTab(stories.FormValidation, 'Script')
		expect(script).toContain('validate:')
		expect(script).not.toContain('validator:')
	})
})
