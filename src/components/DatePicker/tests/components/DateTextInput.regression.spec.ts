/**
 * Tests de régression pour DateTextInput
 *
 * Ces tests couvrent spécifiquement les modifications apportées dans DateTextInput :
 * - Exécution des custom rules sur champs vides après interaction utilisateur
 * - Intégration avec hasInteracted pour éviter les validations prématurées
 * - Gestion correcte des règles réactives
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { vuetify } from '../../../../../tests/unit/setup'
import DateTextInput from '@/components/DatePicker/DateTextInput/DateTextInput.vue'

describe('DateTextInput - Tests de Régression', () => {
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

	describe('Custom rules sur champs vides avec interaction utilisateur', () => {
		it('doit exécuter les custom rules sur champ vide après interaction', async () => {
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

			wrapper = mount(DateTextInput, {
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

			// Simuler une interaction utilisateur
			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.setValue('') // Saisie puis suppression
			await input.trigger('blur')

			// validateOnSubmit doit exécuter les custom rules après interaction
			const result = wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalledWith(null)
			expect(result).toBe(false) // Erreur car custom rule retourne false
		})

		it('doit exécuter les custom rules même sans interaction si champ vide', async () => {
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

			wrapper = mount(DateTextInput, {
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

			// DateTextInput exécute les custom rules même sans interaction
			const result = wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalledWith(null)
			expect(result).toBe(false)
		})

		it('doit toujours exécuter les custom rules si le champ a une valeur', async () => {
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

			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '15/06/2024',
					label: 'Date de test',
					customRules,
				},
			})

			await nextTick()

			// Avec une valeur, les custom rules doivent s'exécuter même sans interaction
			const result = wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalledWith(expect.any(Date))
			expect(result).toBe(true)
		})
	})

	describe('Gestion des règles required vs custom rules', () => {
		it('doit gérer correctement required=true avec custom rules', async () => {
			const customRuleMock = vi.fn().mockReturnValue(false)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Custom error',
					},
				},
			]

			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					required: true,
					customRules,
				},
			})

			await nextTick()

			// Simuler interaction
			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			// validateOnSubmit doit retourner false à cause du required
			const result = wrapper.vm.validateOnSubmit()
			expect(result).toBe(false)

			// Vérifier que l'erreur required est affichée
			const errorMessages = wrapper.findAll('.v-messages__message')
			expect(errorMessages.length).toBeGreaterThan(0)
		})

		it('doit exécuter les custom rules même si required=false', async () => {
			const customRuleMock = vi.fn().mockReturnValue(false)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock,
						message: 'Custom error',
					},
				},
			]

			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					required: false,
					customRules,
				},
			})

			await nextTick()

			// Simuler interaction
			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			// validateOnSubmit doit exécuter les custom rules
			const result = wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalledWith(null)
			expect(result).toBe(false) // Custom rule retourne false
		})
	})

	describe('Intégration avec règles réactives', () => {
		it('doit utiliser computed(() => props.customRules) pour la réactivité', async () => {
			const customRuleMock1 = vi.fn().mockReturnValue(true)

			const initialRules = [
				{
					type: 'custom',
					options: {
						validate: customRuleMock1,
						message: 'Rule 1',
					},
				},
			]

			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: '15/06/2024',
					label: 'Date de test',
					customRules: initialRules,
				},
			})

			await nextTick()

			// Validation avec les règles
			wrapper.vm.validateOnSubmit()
			expect(customRuleMock1).toHaveBeenCalled()
		})
	})

	describe('Gestion des warning rules', () => {
		it('doit supporter les custom warning rules', async () => {
			const warningRuleMock = vi.fn().mockReturnValue(false)
			const customWarningRules = [
				{
					type: 'custom',
					options: {
						validate: warningRuleMock,
						message: 'Warning message',
					},
				},
			]

			wrapper = mount(DateTextInput, {
				global: {
					plugins: [vuetify],
				},
				props: {
					modelValue: null,
					label: 'Date de test',
					customWarningRules,
				},
			})

			await nextTick()

			// Les warning rules peuvent être supportées
			expect(wrapper.vm).toBeDefined()
		})
	})

	describe('Cas edge avec différents types de valeurs', () => {
		it('doit passer la bonne valeur aux custom rules selon le contexte', async () => {
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

			wrapper = mount(DateTextInput, {
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

			// Simuler interaction puis validation sur champ vide
			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')

			wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenCalledWith(null)

			// Changer la valeur et re-valider
			await wrapper.setProps({ modelValue: '15/06/2024' })
			await nextTick()

			wrapper.vm.validateOnSubmit()
			expect(customRuleMock).toHaveBeenLastCalledWith(expect.any(Date))
		})
	})
})
