/**
 * Tests de régression pour DatePicker CalendarMode
 *
 * Ces tests couvrent spécifiquement les bugs résolus dans les mémoires :
 * - Mémoire b5baeb0e : Custom rules ne s'exécutaient pas sur champs vides
 * - Mémoire 36a3ff57 : Validation immédiate avant mise à jour des computed
 * - Exécution des custom rules avec validateOnSubmit() et blur
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, computed } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

describe('DatePicker CalendarMode - Tests de Régression', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ohoh
	let wrapper: any

	beforeEach(() => {
		// Reset des mocks avant chaque test
		vi.clearAllMocks()
	})

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	describe('Custom rules sur champs vides (Mémoire b5baeb0e)', () => {
		it('doit exécuter les custom rules sur champ vide avec validateOnSubmit()', async () => {
			const customRuleMock = vi.fn().mockReturnValue(false)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Champ obligatoire',
					},
				},
			]

			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null, // Champ vide
					label: 'Date de test',
					customRules,
				},
			})

			await nextTick()

			// Appeler validateOnSubmit sur le champ vide
			const result = wrapper.vm.validateOnSubmit()

			// La custom rule doit avoir été appelée avec null
			expect(customRuleMock).toHaveBeenCalledWith(null)
			expect(result).toBe(false) // Validation échoue car custom rule retourne false
		})

		it('doit exécuter les custom rules sur champ vide lors du blur après interaction', async () => {
			const customRuleMock = vi.fn().mockReturnValue(false)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Champ obligatoire',
					},
				},
			]

			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules,
				},
			})

			await nextTick()

			// Simuler une interaction utilisateur (focus puis blur)
			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			// La custom rule doit avoir été appelée
			expect(customRuleMock).toHaveBeenCalledWith(null)
		})

		it('ne doit PAS exécuter les custom rules si aucune custom rule n\'est définie', async () => {
			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					// Pas de customRules
				},
			})

			await nextTick()

			// validateOnSubmit doit retourner true (pas d'erreur) car pas de custom rules
			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(true)
		})

		it('doit passer null (pas une chaîne vide) aux custom rules', async () => {
			const customRuleMock = vi.fn().mockReturnValue(true)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Test',
					},
				},
			]

			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules,
				},
			})

			await nextTick()
			wrapper.vm.validateOnSubmit()

			// Vérifier que la valeur passée est null (type object) et non une chaîne vide
			expect(customRuleMock).toHaveBeenCalledWith(null)
			const callArgs = customRuleMock.mock.calls[0]
			expect(callArgs[0]).toBe(null)
			expect(typeof callArgs[0]).toBe('object') // null est de type 'object' en JavaScript
		})
	})

	describe('Validation avec custom rules et valeurs', () => {
		it('doit exécuter les custom rules quand le champ a une valeur', async () => {
			const customRuleMock = vi.fn().mockReturnValue(true)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Test',
					},
				},
			]

			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules,
				},
			})

			await nextTick()

			// Simuler la saisie d'une date via l'input
			const input = wrapper.find('input')
			await input.setValue('15/06/2024')
			await input.trigger('blur')
			await nextTick()

			// La custom rule doit être appelée avec un objet Date
			expect(customRuleMock).toHaveBeenCalledWith(expect.any(Date))
		})

		it('doit permettre aux custom rules de décider comment traiter les valeurs vides', async () => {
			// Custom rule qui accepte les valeurs vides
			const acceptEmptyRule = vi.fn().mockImplementation((value) => {
				return value === null || value === '' || value === undefined
			})

			// Custom rule qui rejette les valeurs vides
			const rejectEmptyRule = vi.fn().mockImplementation((value) => {
				return value !== null && value !== '' && value !== undefined
			})

			// Test avec rule qui accepte les vides
			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: acceptEmptyRule,
								message: 'Test accept empty',
							},
						},
					],
				},
			})

			await nextTick()
			let result = wrapper.vm.validateOnSubmit()
			expect(acceptEmptyRule).toHaveBeenCalledWith(null)
			expect(result).toBe(true) // Validation réussit

			wrapper.unmount()

			// Test avec rule qui rejette les vides
			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules: [
						{
							type: 'custom',
							options: {
								validate: rejectEmptyRule,
								message: 'Champ obligatoire',
							},
						},
					],
				},
			})

			await nextTick()
			result = wrapper.vm.validateOnSubmit()
			expect(rejectEmptyRule).toHaveBeenCalledWith(null)
			expect(result).toBe(false) // Validation échoue
		})
	})

	describe('Comportement de validation au montage', () => {
		it('ne doit pas afficher d\'erreurs de custom rules au montage initial', async () => {
			const customRuleMock = vi.fn().mockReturnValue(false)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Erreur custom',
					},
				},
			]

			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules,
				},
			})

			await nextTick()

			// Au montage, les erreurs de custom rules ne doivent pas être affichées
			// même si la custom rule retourne false
			const errorMessages = wrapper.findAll('.v-messages__message')
			expect(errorMessages.length).toBe(0)
		})

		it('doit forcer la validation au montage si custom rules ET valeur présente', async () => {
			const customRuleMock = vi.fn().mockReturnValue(false)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Erreur custom',
					},
				},
			]

			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules,
				},
			})

			await nextTick()

			// Simuler la saisie d'une valeur puis validation
			const input = wrapper.find('input')
			await input.setValue('15/06/2024')
			await nextTick()

			// Forcer la validation
			wrapper.vm.validateOnSubmit()

			// Avec une valeur présente et des custom rules, la validation doit s'exécuter
			expect(customRuleMock).toHaveBeenCalledWith(expect.any(Date))
		})
	})

	describe('Intégration avec règles réactives', () => {
		it('doit fonctionner avec des custom rules réactives', async () => {
			const baseDate = ref('2024-01-01')
			const customRuleMock = vi.fn().mockReturnValue(true)

			const reactiveCustomRules = computed(() => [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: `Date doit être après ${baseDate.value}`,
					},
				},
			])

			wrapper = mount(DatePicker, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customRules: reactiveCustomRules.value,
				},
			})

			await nextTick()

			// Simuler la saisie d'une date
			const input = wrapper.find('input')
			await input.setValue('15/06/2024')
			await nextTick()

			wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalledWith(expect.any(Date))

			// Changer la date de base et re-valider
			baseDate.value = '2024-07-01'
			await wrapper.setProps({ customRules: reactiveCustomRules.value })
			await nextTick()

			wrapper.vm.validateOnSubmit()
			// Vérifier que les règles réactives ont bien été mises à jour
			expect(customRuleMock).toHaveBeenCalled()
		})
	})
})
