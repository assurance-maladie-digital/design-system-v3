import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick, ref, computed } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker.vue'

/**
 * Tests de régression pour la validation croisée (dateA -> dateB)
 * Bug précédent : Les règles dateBRules ne se mettaient pas à jour quand dateA changeait
 */
describe('Validation Croisée Regression Tests', () => {
	/**
	 * Test 1 : notBeforeDate avec date dynamique
	 * Scénario : Date B ne peut pas être avant Date A
	 */
	it('met à jour la validation de Date B quand Date A change', async () => {
		const dateA = ref('15/05/2025')

		// Date B avec règle notBeforeDate qui dépend de dateA
		const dateBRules = computed(() => [
			{
				type: 'notBeforeDate',
				options: {
					date: dateA.value,
					message: 'Date B doit être après Date A',
				},
			},
		])

		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date B',
				format: 'DD/MM/YYYY',
				customRules: dateBRules.value,
				successDisplay: 'all',
			},
		})

		// Date B avant Date A (doit être invalide)
		const input = wrapper.find('input')
		await input.setValue('10/05/2025')
		await input.trigger('blur')
		await flushPromises()

		// Doit avoir une erreur
		let errors = wrapper.findAll('.v-messages__message--error')
		expect(errors.length).toBeGreaterThan(0)

		// Changer Date A pour être avant Date B
		dateA.value = '05/05/2025'
		await wrapper.setProps({
			customRules: [
				{
					type: 'notBeforeDate',
					options: {
						date: dateA.value,
						message: 'Date B doit être après Date A',
					},
				},
			],
		})
		await nextTick()

		// Re-valider
		await input.trigger('blur')
		await flushPromises()

		// Maintenant c'est valide (10/05 >= 05/05)
		errors = wrapper.findAll('.v-messages__message--error')
		expect(errors.length).toBe(0)

		wrapper.unmount()
	})

	/**
	 * Test 2 : Validation réactive sans re-saisie
	 * Quand la règle change, la validation doit se mettre à jour automatiquement
	 */
	it('re-valide automatiquement quand les règles changent', async () => {
		const strictMode = ref(false)

		const dynamicRules = computed(() => {
			if (strictMode.value) {
				return [{ type: 'notBeforeToday', options: { message: 'Date future obligatoire' } }]
			}
			return [] // Pas de validation en mode non-strict
		})

		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '01/01/2020', // Date passée
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: dynamicRules.value,
			},
		})

		// En mode non-strict, pas d'erreur
		await flushPromises()
		let errors = wrapper.findAll('.v-messages__message--error')
		expect(errors.length).toBe(0)

		// Passer en mode strict
		strictMode.value = true
		await wrapper.setProps({
			customRules: [{ type: 'notBeforeToday', options: { message: 'Date future obligatoire' } }],
		})
		await nextTick()
		await flushPromises()

		// Maintenant doit y avoir une erreur (date passée en mode strict)
		errors = wrapper.findAll('.v-messages__message--error')
		expect(errors.length).toBeGreaterThan(0)

		wrapper.unmount()
	})

	/**
	 * Test 3 : Pas de validation avec règles vides
	 */
	it('ne valide pas quand customRules est vide', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '',
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: [], // Pas de règles
				successDisplay: 'all',
			},
		})

		const input = wrapper.find('input')
		await input.setValue('15/05/2025')
		await input.trigger('blur')
		await flushPromises()

		// Pas de validation custom, donc validateSpy ne doit pas être appelé
		// (mais le champ peut avoir un succès de validation de format)
		const successMessages = wrapper.findAll('.v-messages__message--success')
		// Un seul message maximum (pas de double validation)
		expect(successMessages.length).toBeLessThanOrEqual(1)

		wrapper.unmount()
	})

	/**
	 * Test 4 : Gestion des valeurs null (bug "Date invalide")
	 * Bug précédent : "Date invalide" s'affichait quand on supprimait la date
	 */
	it('gère les valeurs null sans erreur "Date invalide"', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: null,
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: [{ type: 'notBeforeDate', options: { date: '01/01/2025', message: 'Date trop ancienne' } }],
			},
		})

		await flushPromises()

		// Ne doit pas afficher "Date invalide" pour valeur null
		const errors = wrapper.findAll('.v-messages__message--error')
		const hasDateInvalide = errors.some(e => e.text().includes('Date invalide'))
		expect(hasDateInvalide).toBe(false)

		wrapper.unmount()
	})

	/**
	 * Test 5 : Pas d'erreur "Configuration invalide"
	 * Bug précédent : Message quand options.date = undefined
	 */
	it('ne montre pas "Configuration de la règle invalide" quand la règle est valide', async () => {
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '15/05/2025',
				label: 'Date',
				format: 'DD/MM/YYYY',
				// Règle avec une date valide (pas undefined)
				customRules: [{ type: 'notBeforeDate', options: { date: '01/01/2025', message: 'Date trop ancienne' } }],
			},
		})

		await flushPromises()

		// Ne doit pas avoir de message d'erreur de configuration
		const errors = wrapper.findAll('.v-messages__message--error')
		const hasConfigError = errors.some(e => e.text().includes('Configuration de la règle invalide'))
		expect(hasConfigError).toBe(false)

		wrapper.unmount()
	})
})
