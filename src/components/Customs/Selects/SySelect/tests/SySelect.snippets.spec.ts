import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, type StoryWithSourceCode } from '@tests/helpers/storySnippets'
import * as mainStories from '../SySelect.stories'
import * as validationStories from '../validation/Validation.stories'

const { WithWarning, WithSuccess, NoValidateOnBlur, VFormAndVuetifyValidation } = composeStories(validationStories)

const allStories = [
	...Object.entries(composeStories(mainStories)),
	...Object.entries(composeStories(validationStories)),
]
	.map(([name, story]) => ({ name, story }))
	.filter(({ story }) => Array.isArray(story.parameters.sourceCode))

function snippetCode(story: StoryWithSourceCode): string {
	return JSON.stringify(story.parameters.sourceCode)
}

describe('SySelect snippets', () => {
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

	it.each(allStories)('l\'extrait de $name n\'importe pas SySelect par défaut', ({ story }) => {
		expect(snippetCode(story)).not.toContain('import SySelect from \'@cnamts/synapse\'')
	})

	it.each([
		{ name: 'WithWarning', story: WithWarning },
		{ name: 'WithSuccess', story: WithSuccess },
	])('l\'extrait de $name reproduit la valeur initiale et la validation au montage', ({ story }) => {
		const code = snippetCode(story)

		expect(code).toContain('const value = ref<string | null>(\'1\')')
		expect(code).toContain('ref=\\"selectRef\\"')
		expect(code).toMatch(/onMounted\(\(\) => \{\\n\s*selectRef\.value\?\.validateOnSubmit\(\)/)
	})

	it('l\'extrait de NoValidateOnBlur efface la validation à la réinitialisation', () => {
		expect(snippetCode(NoValidateOnBlur)).toContain('selectRef.value?.clearValidation()')
	})

	it('l\'extrait de VFormAndVuetifyValidation signale une soumission invalide', () => {
		expect(snippetCode(VFormAndVuetifyValidation)).toContain('Formulaire invalide')
	})
})
