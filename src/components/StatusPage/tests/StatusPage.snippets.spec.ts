import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as stories from '../StatusPage.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({ name, story }))

describe('StatusPage snippets', () => {
	it.each(allStories)('l\'extrait de $name importe tous les composants utilisés', ({ story }) => {
		expect(analyzeSnippet(story).unresolvedComponents).toEqual([])
	})
})
