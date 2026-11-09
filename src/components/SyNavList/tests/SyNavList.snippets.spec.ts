import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../SyNavList.stories'

// LabsNotice est le bandeau de la documentation, pas un exemple du composant
const allStories = Object.entries(composeStories(stories))
	.filter(([name]) => name !== 'LabsNotice')
	.map(([name, story]) => ({ name, story }))

describe('SyNavList snippets', () => {
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
})
