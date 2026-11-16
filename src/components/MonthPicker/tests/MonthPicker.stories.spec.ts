import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as validationStories from '../Validation/Validation.stories'

const { SyFormValidation, VFormVuetifyValidation } = composeStories(validationStories)

enableAutoUnmount(afterEach)

afterEach(() => {
	vi.unstubAllGlobals()
})

describe('MonthPicker validation stories', () => {
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

	it('VFormVuetifyValidation rend le champ requis, comme le code affiché', () => {
		const wrapper = mount(VFormVuetifyValidation())

		expect(wrapper.find('input').attributes('aria-required')).toBe('true')
	})
})
