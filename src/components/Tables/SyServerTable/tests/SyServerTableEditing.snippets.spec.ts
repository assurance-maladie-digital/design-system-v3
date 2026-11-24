import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as bulkActions from '../BulkActions.stories'
import * as rowEditing from '../RowEditing.stories'

const groups = [
	{ name: 'BulkActions', stories: composeStories(bulkActions) },
	{ name: 'RowEditing', stories: composeStories(rowEditing) },
]

for (const group of groups) {
	describe(`${group.name} snippets`, () => {
		it.each(Object.entries(group.stories))('l\'extrait de %s est autonome et copiable', (_name, story) => {
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
}
