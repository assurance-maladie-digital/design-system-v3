import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { composeStories } from '@storybook/vue3-vite'
import * as stories from '../validation/Validation.stories'

const { NoValidateOnBlur, BidirectionalValidation, WithError } = composeStories(stories)

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

		const [start, end] = wrapper.findAll('input')
		const type = async (input: typeof start, value: string) => {
			await input!.trigger('focus')
			await input!.setValue(value)
			await input!.trigger('blur')
			await flushPromises()
		}

		await type(end, '10/01/2025')
		await type(start, '20/01/2025')
		// La date de début postérieure à la date de fin invalide la date de fin
		expect(wrapper.text()).toContain('La date de fin ne peut pas être antérieure à la date de début')

		await type(start, '05/01/2025')
		// Corriger la date de début retire l'erreur de la date de fin sans la toucher
		expect(wrapper.text()).not.toContain('La date de fin ne peut pas être antérieure à la date de début')
		expect(wrapper.text()).not.toContain('La date de début ne peut pas être postérieure à la date de fin')
	})

	it('WithError garde la saisie même si modelValue est renseigné dans les Controls', async () => {
		const wrapper = mount(WithError({ modelValue: '01/01/2000' }), { attachTo: document.body })
		await flushPromises()

		const input = wrapper.find('input')
		// La valeur locale de la story l'emporte sur args.modelValue
		expect((input.element as HTMLInputElement).value).toBe('01/01/2100')

		await input.trigger('focus')
		await input.setValue('15/03/2020')
		await input.trigger('blur')
		await flushPromises()
		expect((input.element as HTMLInputElement).value).toBe('15/03/2020')
		expect(wrapper.text()).toContain('Valeur actuelle : 15/03/2020')
	})
})
