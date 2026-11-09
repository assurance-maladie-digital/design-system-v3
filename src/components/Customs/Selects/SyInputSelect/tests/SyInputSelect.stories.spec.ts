import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../SyInputSelect.stories'

const sourceCodeStories = Object.entries(composeStories(stories))
	.map(([name, story]) => ({ name, story }))
	.filter(({ story }) => Array.isArray(story.parameters.sourceCode))

describe('SyInputSelect stories', () => {
	it.each(sourceCodeStories)('l\'extrait de $name est un SFC autonome et copiable', ({ story }) => {
		expect(analyzeSnippet(story)).toEqual({
			parseErrors: [],
			hasScriptSetup: true,
			undeclaredIdentifiers: [],
			unresolvedComponents: [],
			untypedRefs: [],
			invalidAttributes: [],
		})
	})

	it.each(sourceCodeStories)('$name importe SyInputSelect depuis son export public nommé', ({ story }) => {
		expect(JSON.stringify(story.parameters.sourceCode))
			.toContain('import { SyInputSelect } from \'@cnamts/synapse\'')
	})
})
