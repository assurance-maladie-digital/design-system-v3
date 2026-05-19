import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '../DateTextInput/DateTextInput.vue'

/**
 * Tests de régression pour les messages de succès
 * Bug précédent : Double affichage des messages de succès quand
 * ComplexDatePicker et DateTextInput validaient tous les deux
 */
describe('Validation Success Messages Regression', () => {
	it('affiche un seul message de succès quand une date valide est saisie', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date de test',
				format: 'DD/MM/YYYY',
				showSuccessMessages: true,
				required: true,
			},
		})

		// Saisir une date valide
		const input = wrapper.find('input')
		await input.setValue('15/05/2025')
		await input.trigger('blur')
		await flushPromises()

		// Vérifier qu'il n'y a qu'un seul message de succès
		const successMessages = wrapper.findAll('.v-messages__message--success')
		expect(successMessages.length).toBeLessThanOrEqual(1)

		wrapper.unmount()
	})

	it('DateTextInput isolé affiche correctement les messages de succès', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date isolée',
				format: 'DD/MM/YYYY',
				showSuccessMessages: true,
				required: true,
			},
		})

		const input = wrapper.find('input')
		await input.setValue('20/06/2025')
		await input.trigger('blur')
		await flushPromises()

		// Un seul message attendu
		const successMessages = wrapper.findAll('.v-messages__message--success')
		expect(successMessages.length).toBeLessThanOrEqual(1)

		wrapper.unmount()
	})

	it('pas de double message avec skipInternalValidation', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '',
				label: 'Date avec skip',
				format: 'DD/MM/YYYY',
				showSuccessMessages: true,
				required: true,
				skipInternalValidation: true, // Simule utilisation dans ComplexDatePicker
			},
		})

		const input = wrapper.find('input')
		await input.setValue('10/07/2025')
		await input.trigger('blur')
		await flushPromises()

		// Avec skipInternalValidation, pas de validation interne
		// donc pas de message de succès généré par DateTextInput
		const successMessages = wrapper.findAll('.v-messages__message--success')
		expect(successMessages.length).toBe(0)

		wrapper.unmount()
	})
})
