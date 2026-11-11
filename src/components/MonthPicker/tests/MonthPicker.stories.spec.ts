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

describe('MonthPicker validation stories', () => {
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

	it('SyFormValidation ne laisse pas args écraser la valeur saisie', async () => {
		const wrapper = mount(SyFormValidation(), { attachTo: document.body })
		const input = wrapper.find('input')

		await input.setValue('03/2026')
		await flushPromises()

		expect((input.element as HTMLInputElement).value).toContain('03/2026')
	})
})
