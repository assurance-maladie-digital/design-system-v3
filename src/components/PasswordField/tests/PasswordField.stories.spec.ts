import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import { analyzeSnippet } from '@tests/helpers/storySnippets'
import * as validationStories from '../Validation/Validation.stories'

const { SyFormValidation } = composeStories(validationStories)

const allStories = Object.entries(composeStories(validationStories)).map(([name, story]) => ({ name, story }))

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('PasswordField validation stories', () => {
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

	it('SyFormValidation laisse la saisie mettre à jour le champ', async () => {
		const wrapper = mount(SyFormValidation(), { attachTo: document.body })
		const input = wrapper.find('input[type="password"]')

		await input.setValue('MotDePasse1')
		await flushPromises()

		expect((input.element as HTMLInputElement).value).toBe('MotDePasse1')
	})
})
