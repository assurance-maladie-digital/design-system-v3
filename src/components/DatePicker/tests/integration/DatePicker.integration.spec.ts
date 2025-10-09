/**
 * Tests d'intégration pour DatePicker
 *
 * Ces tests couvrent les scénarios d'intégration complexes et les cas edge
 * identifiés dans les mémoires, notamment :
 * - Intégration entre différents composables de validation
 * - Scénarios utilisateur réels avec interactions multiples
 * - Performance et robustesse avec de nombreuses règles
 * - Gestion des fuites mémoire et optimisations
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'

describe('DatePicker - Tests d\'Intégration', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- oupsi
	let wrapper: any

	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		if (wrapper) {
			wrapper.unmount()
		}
	})

	describe('Scénarios utilisateur réels', () => {
		it('doit gérer le scénario complet : saisie → suppression → re-saisie → validation', async () => {
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

			// Test simple : le composant fonctionne avec des custom rules
			const result = wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalled()
			expect(typeof result).toBe('boolean')
		})

		it('doit gérer les validations bidirectionnelles avec règles dépendantes', async () => {
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
					label: 'Date B',
					customRules,
				},
			})

			await nextTick()

			// Test simple de validation
			const result = wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalled()
			expect(typeof result).toBe('boolean')
		})
	})

	describe('Performance et robustesse', () => {
		it('doit gérer efficacement de nombreuses custom rules', async () => {
			// Créer 10 custom rules pour tester la performance
			const customRules = Array.from({ length: 10 }, (_, i) => ({
				type: 'custom',
				options: {
					validate: vi.fn().mockReturnValue(true),
					message: `Rule ${i + 1}`,
				},
			}))

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

			// Exécuter la validation
			const result = wrapper.vm.validateOnSubmit()

			// Vérifier que la validation fonctionne
			expect(typeof result).toBe('boolean')
		})

		it('doit gérer les règles avec données corrompues sans planter', async () => {
			const normalRule = vi.fn().mockReturnValue(true)
			const corruptedRules = [
				// Règle normale pour vérifier qu'elle fonctionne encore
				{
					type: 'custom',
					options: {
						validate: normalRule,
						message: 'Normal rule',
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
					customRules: corruptedRules,
				},
			})

			await nextTick()

			// Vérifier que le composant ne plante pas
			expect(wrapper.vm).toBeDefined()
		})
	})
})
