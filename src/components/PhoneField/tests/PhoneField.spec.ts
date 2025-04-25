import { mount } from '@vue/test-utils'
import PhoneField from '../PhoneField.vue'
import { describe, it, expect } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
	components,
	directives,
})
describe('PhoneField', () => {
	it('renders correctly with default props', () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.exists()).toBe(true)
	})

	it('emits update:modelValue and change events on phone input', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
		})
		const input = wrapper.find('input')
		await input.setValue('1234567890')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('change')).toBeTruthy()
	})

	it('validates phone number and country code on blur', async () => {
	})

	it('applies default phone mask correctly', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: { modelValue: '0619123456' },
		})
		expect(wrapper.vm.computedValue).toBe('06 19 12 34 56')
	})

	it('renders SySelect when withCountryCode is true', () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: { withCountryCode: true },
		})
		expect(wrapper.findComponent({ name: 'SySelect' }).exists()).toBe(true)
	})

	it('validates country code when countryCodeRequired is true', async () => {
	})

	it('updates phone mask and counter when dialCode changes', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: { withCountryCode: true },
		})
		wrapper.vm.dialCode = { code: '+1', phoneLength: 10, mask: '###-###-####' }
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.phoneMask).toBe('###-###-####')
		expect(wrapper.vm.counter).toBe(10)
	})

	it('validates phone number and country code on blur', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
				countryCodeRequired: true,
				modelValue: '1234567890',
				withCountryCode: true,
				isValidatedOnBlur: true,
			},
		})

		// Simulate selecting a country code
		wrapper.vm.dialCode = { code: '+1', phoneLength: 10, mask: '###-###-####' }
		await wrapper.vm.$nextTick()

		// Simulate blur event
		const input = wrapper.find('input')
		await input.trigger('blur')

		// Check if validation was performed
		expect(wrapper.vm.hasError).toBe(false)
	})

	it('uses only custom indicatifs when useCustomIndicatifsOnly is true', () => {
		const customIndicatifs = [{ code: '+99', abbreviation: 'XX', country: 'Testland', phoneLength: 10 }]
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				useCustomIndicatifsOnly: true,
				customIndicatifs,
			},
		})

		expect(wrapper.vm.mergedDialCodes).toEqual(customIndicatifs)
	})

	it('validates phone number and country code on blur', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
				countryCodeRequired: true,
				modelValue: '1234567890',
				withCountryCode: true,
				isValidatedOnBlur: true,
			},
		})

		wrapper.vm.dialCode = { code: '+1', phoneLength: 10, mask: '###-###-####' }
		await wrapper.vm.$nextTick()

		const input = wrapper.find('input')
		await input.trigger('blur')

		expect(wrapper.vm.hasError).toBe(false)
	})

	it('renders VTextField with outlined variant when outlined prop is true', () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				outlined: true,
			},
		})

		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.props('variant')).toBe('outlined')
	})

	it('renders VTextField with underlined variant when outlined prop is false', () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				outlined: false,
			},
		})

		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.props('variant')).toBe('underlined')
	})

	it('passes dialCode object to SyTextField when dialCode is set', async () => {
		const dialCodeModelValue = { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' }

		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				dialCodeModel: dialCodeModelValue,
			},
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.vm.dialCode).toBeDefined()
		expect(typeof wrapper.vm.dialCode).toBe('object')

		type Indicatif = {
			code: string
			country: string
			abbreviation: string
			phoneLength: number
			mask: string
			displayText?: string
		}
		const dialCode = wrapper.vm.dialCode as Indicatif

		expect(dialCode.code).toBe('+33')
		expect(dialCode.country).toBe('France')
		expect(dialCode.phoneLength).toBe(10)
		expect(dialCode.abbreviation).toBe('FR')
		expect(dialCode.mask).toBe('## ## ## ## ##')

		expect(dialCode).toHaveProperty('displayText')
		expect(typeof dialCode.displayText).toBe('string')

		expect(wrapper.vm.phoneMask).toBe('## ## ## ## ##')
		expect(wrapper.vm.counter).toBe(10)

		const textField = wrapper.findComponent({ name: 'SyTextField' })
		expect(textField.exists()).toBe(true)
		expect(textField.props('counter')).toBe(10)

		const select = wrapper.findComponent({ name: 'SySelect' })
		expect(select.exists()).toBe(true)
		expect(select.props('returnObject')).toBe(true)

		expect(select.props('modelValue')).toEqual(wrapper.vm.dialCode)
	})

	// Test du watcher pour dialCodeModel
	it('updates dialCode when dialCodeModel changes after mount', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				// Pas de dialCodeModel initial
			},
		})

		// Vérifier que dialCode est initialisé avec une chaîne vide
		// Dans le composant: const dialCode = ref<string | Record<string, any>>(props.dialCodeModel || '')
		expect(wrapper.vm.dialCode).toBe('')

		// Définir un dialCodeModel après le montage
		await wrapper.setProps({
			dialCodeModel: { code: '+1', country: 'USA', abbreviation: 'US', phoneLength: 10, mask: '###-###-####' },
		})

		// Attendre que le watcher s'exécute
		await wrapper.vm.$nextTick()

		// Vérifier que dialCode a été mis à jour
		expect(wrapper.vm.dialCode).toBeDefined()
		expect(typeof wrapper.vm.dialCode).toBe('object')

		// Utiliser une assertion de type pour indiquer à TypeScript que dialCode est un objet
		type Indicatif = {
			code: string
			country: string
			abbreviation: string
			phoneLength: number
			mask: string
			displayText?: string
		}
		const dialCode = wrapper.vm.dialCode as Indicatif

		expect(dialCode.code).toBe('+1')
		expect(dialCode.country).toBe('USA/Canada')
		expect(wrapper.vm.phoneMask).toBe('### ### ####')
		expect(wrapper.vm.counter).toBe(10)
	})

	// Test pour les objets sans displayText
	it('handles dialCodeModel objects without displayText property', async () => {
		// Objet indicatif sans propriété displayText
		const indicatifSansDisplayText = {
			code: '+44',
			country: 'United Kingdom',
			abbreviation: 'GB',
			phoneLength: 10,
			mask: '#### ### ####',
		}

		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				dialCodeModel: indicatifSansDisplayText,
			},
		})

		await wrapper.vm.$nextTick()

		// Vérifier que dialCode a été correctement initialisé
		expect(wrapper.vm.dialCode).toBeDefined()

		// Utiliser une assertion de type pour indiquer à TypeScript que dialCode est un objet
		type Indicatif = {
			code: string
			country: string
			abbreviation: string
			phoneLength: number
			mask: string
			displayText?: string
		}
		const dialCode = wrapper.vm.dialCode as Indicatif

		expect(dialCode.code).toBe('+44')
		expect(dialCode.country).toBe('United Kingdom')

		// Vérifier que la propriété displayText a été ajoutée
		expect(dialCode).toHaveProperty('displayText')
		expect(typeof dialCode.displayText).toBe('string')
		// Le format exact dépend de la fonction generateDisplayText, mais on peut vérifier qu'il contient le code
		expect(dialCode.displayText).toContain('+44')
	})

	// Test avec les indicatifs standards importés
	it('works correctly with standard indicatifs imported from indicatifs.ts', async () => {
		// Importer les indicatifs standards
		const { indicatifs } = await import('../indicatifs')

		// Trouver l'indicatif pour la France
		const franceIndicatif = indicatifs.find(ind => ind.country === 'France')
		expect(franceIndicatif).toBeDefined()

		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				dialCodeModel: franceIndicatif,
			},
		})

		await wrapper.vm.$nextTick()

		// Vérifier que l'indicatif a été correctement appliqué
		expect(wrapper.vm.dialCode).toBeDefined()

		// Utiliser une assertion de type pour indiquer à TypeScript que dialCode est un objet
		type Indicatif = {
			code: string
			country: string
			abbreviation: string
			phoneLength: number
			mask: string
			displayText?: string
		}
		const dialCode = wrapper.vm.dialCode as Indicatif

		expect(dialCode.code).toBe('+33')
		expect(dialCode.country).toBe('France')

		// Vérifier que le SySelect affiche la bonne valeur
		const select = wrapper.findComponent({ name: 'SySelect' })
		expect(select.exists()).toBe(true)
		expect(select.props('modelValue')).toEqual(wrapper.vm.dialCode)
	})
})
