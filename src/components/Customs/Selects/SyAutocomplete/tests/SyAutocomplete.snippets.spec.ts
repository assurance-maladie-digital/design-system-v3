import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, type StoryWithSourceCode } from '@tests/helpers/storySnippets'
// SyAutocomplete.stories importe un fichier .mdx, non chargeable par Vitest : seules les stories de validation sont couvertes.
import * as validationStories from '../validation/Validation.stories'

const { NoValidateOnBlur, VFormAndVuetifyValidation } = composeStories(validationStories)

const allStories = Object.entries(composeStories(validationStories))
	.map(([name, story]) => ({ name, story }))
	.filter(({ story }) => Array.isArray(story.parameters.sourceCode))

function snippetCode(story: StoryWithSourceCode): string {
	return JSON.stringify(story.parameters.sourceCode)
}

describe('SyAutocomplete snippets', () => {
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

	it('l\'extrait de NoValidateOnBlur efface la validation à la réinitialisation', () => {
		expect(snippetCode(NoValidateOnBlur)).toContain('autocompleteRef.value?.clearValidation()')
	})

	it('l\'extrait de VFormAndVuetifyValidation signale une soumission invalide', () => {
		expect(snippetCode(VFormAndVuetifyValidation)).toContain('Formulaire invalide')
	})
})
