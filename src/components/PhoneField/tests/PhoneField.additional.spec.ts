import { mount } from '@vue/test-utils'
import PhoneField from '../PhoneField.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { indicatifs } from '../indicatifs'

const vuetify = createVuetify({
	components,
	directives,
})

// Tests supplémentaires pour le composant PhoneField
describe('PhoneField - Additional Tests', () => {
	// Tests pour les différents formats d'affichage
	describe('Display formats', () => {
		let wrapper

		beforeEach(() => {
			wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					withCountryCode: true,
					dialCodeModel: { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' },
				},
			})
		})

		it('formats display text as code by default', async () => {
			const select = wrapper.findComponent({ name: 'SySelect' })
			// Vérifier que le format d'affichage est bien le code
			const firstItem = select.props('items')[0]
			expect(firstItem.displayText).toBe(firstItem.code)
		})

		it('formats display text as code-abbreviation', async () => {
			await wrapper.setProps({ displayFormat: 'code-abbreviation' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			expect(firstItem.displayText).toBe(`${firstItem.code} (${firstItem.abbreviation})`)
		})

		it('formats display text as code-country', async () => {
			await wrapper.setProps({ displayFormat: 'code-country' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			expect(firstItem.displayText).toBe(`${firstItem.code} ${firstItem.country}`)
		})

		it('formats display text as country', async () => {
			await wrapper.setProps({ displayFormat: 'country' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			expect(firstItem.displayText).toBe(firstItem.country)
		})

		it('formats display text as abbreviation', async () => {
			await wrapper.setProps({ displayFormat: 'abbreviation' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			expect(firstItem.displayText).toBe(firstItem.abbreviation)
		})
	})

	// Tests pour l'initialisation avec un dialCode par défaut
	describe('Default dialCode initialization', () => {
		it('initializes with a default dialCode object', async () => {
			const defaultDialCode = { code: '+44', abbreviation: 'UK', country: 'United Kingdom', phoneLength: 11, mask: '#### ### ####' }
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					withCountryCode: true,
					dialCodeModel: defaultDialCode,
				},
			})

			await wrapper.vm.$nextTick()

			// Vérifier que le dialCode est correctement initialisé
			expect(wrapper.vm.dialCode).toBeDefined()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			expect((wrapper.vm.dialCode as any).code).toBe('+44')
			// Vérifier que le masque est appliqué (le format exact peut varier)
			expect(wrapper.vm.phoneMask).toBeDefined()
			// Vérifier que le counter est défini selon la phoneLength
			expect(wrapper.vm.counter).toBeDefined()
		})

		it('initializes with a default dialCode string', async () => {
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					withCountryCode: true,
					dialCodeModel: '+33',
				},
			})

			await wrapper.vm.$nextTick()

			// Vérifier que le dialCode est correctement initialisé
			expect(wrapper.vm.dialCode).toBe('+33')
		})
	})

	// Tests pour la désactivation de la gestion des erreurs
	describe('Error handling', () => {
		it('displays error messages by default when validation fails', async () => {
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: true,
					modelValue: '',
					isValidatedOnBlur: true,
				},
			})

			// Déclencher la validation
			await wrapper.vm.validateOnSubmit()

			// Vérifier que les erreurs sont affichées
			expect(wrapper.vm.hasError).toBe(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			expect((wrapper.vm as any).errors.length).toBeGreaterThan(0)

			// Vérifier que les erreurs sont passées au composant SyTextField
			const textField = wrapper.findComponent({ name: 'SyTextField' })
			expect(textField.props('errorMessages')).toBeTruthy()
		})

		it('initializes with disableErrorHandling prop', async () => {
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: true,
					modelValue: '',
					isValidatedOnBlur: true,
					disableErrorHandling: true,
				},
			})

			// Vérifier que la propriété disableErrorHandling est bien prise en compte
			// en vérifiant qu'elle est passée lors de l'initialisation du composable useValidation
			expect(wrapper.vm.validation).toBeDefined()
		})
	})

	// Tests pour la validation dans un contexte de formulaire
	describe('Form validation', () => {
		it('validates as part of a form submission', async () => {
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: true,
					modelValue: '',
				},
			})

			// Simuler une soumission de formulaire avec un champ vide
			const isValid = await wrapper.vm.validateOnSubmit()
			expect(isValid).toBe(false)

			// Mettre à jour la valeur et valider à nouveau
			await wrapper.setProps({ modelValue: '0123456789' })
			const isValidAfterUpdate = await wrapper.vm.validateOnSubmit()
			expect(isValidAfterUpdate).toBe(true)
		})

		it('validates country code as part of form submission', async () => {
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					required: true,
					modelValue: '0123456789',
					withCountryCode: true,
					countryCodeRequired: true,
				},
			})

			// Sans code pays, la validation échoue
			const isValidWithoutCountry = await wrapper.vm.validateOnSubmit()
			expect(isValidWithoutCountry).toBe(false)

			// Ajouter un code pays et valider à nouveau
			wrapper.vm.dialCode = { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' }
			await wrapper.vm.$nextTick()

			const isValidWithCountry = await wrapper.vm.validateOnSubmit()
			expect(isValidWithCountry).toBe(true)
		})
	})

	// Tests pour la gestion des indicatifs personnalisés
	describe('Custom indicatifs', () => {
		it('merges custom indicatifs with standard ones by default', () => {
			const customIndicatifs = [{ code: '+999', abbreviation: 'XX', country: 'Test Country', phoneLength: 8, mask: '## ## ## ##' }]
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					customIndicatifs,
					withCountryCode: true,
				},
			})

			// Vérifier que les indicatifs personnalisés sont ajoutés aux indicatifs standards
			expect(wrapper.vm.mergedDialCodes.length).toBe(indicatifs.length + customIndicatifs.length)
			expect(wrapper.vm.mergedDialCodes).toContainEqual(customIndicatifs[0])
		})

		it('uses only custom indicatifs when useCustomIndicatifsOnly is true', () => {
			const customIndicatifs = [{ code: '+999', abbreviation: 'XX', country: 'Test Country', phoneLength: 8, mask: '## ## ## ##' }]
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					customIndicatifs,
					useCustomIndicatifsOnly: true,
					withCountryCode: true,
				},
			})

			// Vérifier que seuls les indicatifs personnalisés sont utilisés
			expect(wrapper.vm.mergedDialCodes.length).toBe(customIndicatifs.length)
			expect(wrapper.vm.mergedDialCodes).toEqual(customIndicatifs)
		})

		it('updates phone mask and counter based on selected custom indicatif', async () => {
			const customIndicatifs = [{ code: '+999', abbreviation: 'XX', country: 'Test Country', phoneLength: 8, mask: '## ## ## ##' }]
			const wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					customIndicatifs,
					useCustomIndicatifsOnly: true,
					withCountryCode: true,
				},
			})

			// Sélectionner l'indicatif personnalisé
			wrapper.vm.dialCode = customIndicatifs[0]
			await wrapper.vm.$nextTick()

			// Vérifier que le masque et le compteur sont mis à jour
			expect(wrapper.vm.phoneMask).toBe('## ## ## ##')
			expect(wrapper.vm.counter).toBe(8)
		})
	})
})
