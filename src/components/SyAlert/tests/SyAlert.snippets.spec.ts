import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, findUnknownSnippetImports } from '@tests/helpers/storySnippets'
import * as stories from '../SyAlert.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

describe('SyAlert snippets', () => {
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
})
