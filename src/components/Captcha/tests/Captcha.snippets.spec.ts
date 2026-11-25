import { describe, expect, it } from 'vitest'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet, getSnippetTab } from '@tests/helpers/storySnippets'
import * as stories from '../validation/validation.stories'

const allStories = Object.entries(composeStories(stories)).map(([name, story]) => ({
	name,
	story,
	// Args déclarés par la story elle-même, sans les valeurs par défaut de Meta.
	ownArgs: Object.entries(stories).find(([exportName]) => exportName === name)?.[1].args ?? {},
}))

describe('Captcha validation snippets', () => {
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

	it.each(allStories)('l\'extrait de $name déclare showSuccessMessages comme la story', ({ story, ownArgs }) => {
		const template = getSnippetTab(story, 'Template')
		const showsSuccess = /successMessage|:success-messages/.test(template + getSnippetTab(story, 'Script'))

		if (showsSuccess) {
			expect(ownArgs.showSuccessMessages).toBe(true)
			expect(template).toContain('show-success-messages')
		}
	})

	it.each(allStories)('l\'extrait de $name déclare required comme la story', ({ story, ownArgs }) => {
		const template = getSnippetTab(story, 'Template')
		const snippetOptional = template.includes(':required="false"')
		const snippetRequired = /\srequired[\s/>]/.test(template)

		expect(ownArgs).toHaveProperty('required')
		expect(snippetRequired || snippetOptional).toBe(true)
		expect(story.args.required).toBe(snippetRequired && !snippetOptional)
	})

	// DisableErrorHandling compare deux champs pilotés par la démo, sans lien avec args.modelValue.
	it.each(allStories.filter(({ name }) => name !== 'DisableErrorHandling'))('l\'extrait de $name initialise la valeur comme la story', ({ story, ownArgs }) => {
		const initialValue = getSnippetTab(story, 'Script').match(/const value = ref\('([^']*)'\)|const modelValue = ref\('([^']*)'\)/)

		expect(initialValue).not.toBeNull()
		expect(ownArgs).toHaveProperty('modelValue', initialValue![1] ?? initialValue![2])
	})
})
