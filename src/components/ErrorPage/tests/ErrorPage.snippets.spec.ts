import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, type StoryWithSourceCode } from '@tests/helpers/storySnippets'
import * as stories from '../ErrorPage.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

function snippetCode(story: StoryWithSourceCode): string {
	const { sourceCode } = story.parameters
	return JSON.stringify(sourceCode)
}

describe('ErrorPage snippets', () => {
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

	it.each(allStories)('l\'extrait de $name ne reprend pas l\'habillage Storybook ni de couleur codée en dur', ({ story }) => {
		const code = snippetCode(story)

		expect(code).not.toContain('rgb(231, 236, 245)')
		expect(code).not.toMatch(/#[0-9a-f]{3,6}\b/i)
	})
})
