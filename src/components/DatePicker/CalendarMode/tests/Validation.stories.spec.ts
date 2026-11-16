import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import DatePicker from '../DatePicker.vue'
import * as stories from '../validation/Validation.stories'

const { NoValidateOnBlur, BidirectionalValidation } = composeStories(stories)

enableAutoUnmount(afterEach)

describe('DatePicker CalendarMode validation stories', () => {
	it('NoValidateOnBlur valide la valeur appliquée par le bouton, et non la précédente', async () => {
		const wrapper = mount(NoValidateOnBlur(), { attachTo: document.body })
		await flushPromises()

		const invalidButton = wrapper.findAll('button').find(button => button.text() === 'Valeur invalide')!
		await invalidButton.trigger('click')
		await flushPromises()
		// La validation porte sur la nouvelle valeur (01/01/2100), propagée avant validateOnSubmit()
		expect(wrapper.text()).toContain('La date ne peut pas être dans le futur')
		expect(wrapper.text()).not.toContain('Le champ est requis')
	})

	it('BidirectionalValidation revalide la date de fin quand la date de début change', async () => {
		const wrapper = mount(BidirectionalValidation(), { attachTo: document.body })
		await flushPromises()

		const [start, end] = wrapper.findAllComponents(DatePicker)
		await end!.vm.$emit('update:modelValue', '10/01/2025')
		await flushPromises()
		await start!.vm.$emit('update:modelValue', '20/01/2025')
		await flushPromises()
		// La date de début postérieure à la date de fin invalide la date de fin
		expect(wrapper.text()).toContain('La date de fin ne peut pas être antérieure à la date de début')

		await start!.vm.$emit('update:modelValue', '05/01/2025')
		await flushPromises()
		// Corriger la date de début retire l'erreur de la date de fin sans la toucher
		expect(wrapper.text()).not.toContain('La date de fin ne peut pas être antérieure à la date de début')
		expect(wrapper.text()).not.toContain('La date de début ne peut pas être postérieure à la date de fin')
	})
})
