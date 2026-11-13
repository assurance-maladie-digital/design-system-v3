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
		const alertMock = vi.fn()
		vi.stubGlobal('alert', alertMock)
		const onUpdate = vi.fn()
		const wrapper = mount(SyFormValidation({ 'onUpdate:modelValue': onUpdate }), { attachTo: document.body })
		const input = wrapper.find('input')

		await input.setValue('03/2026')
		await flushPromises()
		// Vérifie ce qui sort du composant : la saisie est bien émise vers le parent
		expect(onUpdate).toHaveBeenCalledWith('03/2026')

		// La soumission valide la valeur saisie (et non une valeur fantôme) : le résultat remonte à handleSubmit
		await wrapper.find('form').trigger('submit')
		await flushPromises()
		expect(alertMock).toHaveBeenCalledWith('Mois valide !')
	})
})
