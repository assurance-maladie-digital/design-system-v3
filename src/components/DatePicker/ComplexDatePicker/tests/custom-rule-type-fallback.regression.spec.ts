import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ComplexDatePicker from '../ComplexDatePicker.vue'

/**
 * Tests de régression pour le type transmis aux règles personnalisées.
 *
 * Bug constaté : à la soumission, les règles custom sont appliquées deux fois —
 * une fois sur la saisie texte (chaîne) puis une fois sur les dates retenues
 * (objet Date). Une règle écrite pour une chaîne (ex: `value.includes('2025')`)
 * levait une exception sur le Date, convertie silencieusement en échec :
 * une date valide était refusée.
 *
 * Correctif : les règles custom sont enveloppées avec un repli « chaîne
 * formatée » quand la valeur validée est un Date (adaptCustomRulesWithStringFallback).
 */
describe('Type transmis aux règles custom — tests de régression', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	/**
	 * Reproduction du bug : règle écrite pour une chaîne + soumission.
	 * Avant le fix : validateOnSubmit() renvoyait false et « Pas de 2025 »
	 * s'affichait alors que la date était valide pour la règle.
	 */
	it('accepte à la soumission une date valide pour une règle écrite pour une chaîne', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})

		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: null,
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: [
					{
						type: 'custom',
						options: {
							// Règle écrite pour une chaîne : lève une TypeError sur un Date
							validate: (value: unknown) => !(value as string).includes('2025'),
							message: 'Pas de 2025',
						},
					},
				],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('15/03/2026')
		await input.trigger('blur')
		await flushPromises()

		// Au blur : aucun message d'erreur
		expect(wrapper.findAll('.v-messages__message--error')).toHaveLength(0)

		// Avant le fix : false + « Pas de 2025 » affiché à tort
		const result = await wrapper.vm.validateOnSubmit()
		await flushPromises()

		expect(result).toBe(true)
		expect(wrapper.text()).not.toContain('Pas de 2025')

		wrapper.unmount()
	})

	/**
	 * Une règle écrite pour une chaîne doit toujours pouvoir refuser une date.
	 */
	it('refuse à la soumission une date invalide pour une règle écrite pour une chaîne', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})

		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: null,
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: [
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => !(value as string).includes('2025'),
							message: 'Pas de 2025',
						},
					},
				],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('15/03/2025')
		await input.trigger('blur')
		await flushPromises()

		const result = await wrapper.vm.validateOnSubmit()
		await flushPromises()

		expect(result).toBe(false)
		expect(wrapper.text()).toContain('Pas de 2025')

		wrapper.unmount()
	})

	/**
	 * Une règle écrite pour un objet Date doit garder un comportement identique :
	 * elle reçoit toujours le Date et n'est pas rappelée avec la chaîne.
	 */
	it('préserve le comportement d\'une règle écrite pour un objet Date', async () => {
		const receivedTypes: string[] = []

		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: null,
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: [
					{
						type: 'custom',
						options: {
							validate: (value: unknown) => {
								receivedTypes.push(value instanceof Date ? 'date' : typeof value)
								return !(value instanceof Date) || value.getFullYear() !== 2025
							},
							message: 'Pas de 2025',
						},
					},
				],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('15/03/2026')
		await input.trigger('blur')
		await flushPromises()

		const result = await wrapper.vm.validateOnSubmit()
		await flushPromises()

		expect(result).toBe(true)
		// La règle a bien reçu un objet Date au moins une fois (validation des dates retenues)
		expect(receivedTypes).toContain('date')

		wrapper.unmount()
	})
})
