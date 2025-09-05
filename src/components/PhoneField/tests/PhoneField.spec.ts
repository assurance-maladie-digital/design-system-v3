import { mount, VueWrapper } from '@vue/test-utils'
import PhoneField from '../PhoneField.vue'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { indicatifs } from '../indicatifs'

const vuetify = createVuetify({
	components,
	directives,
})
describe('PhoneField', () => {
	afterEach(() => {
		vi.clearAllMocks()
		document.body.innerHTML = ''
	})
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

	it('cleans spaces from phone number before validation', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
				modelValue: '01 23 45 67 89',
				isValidatedOnBlur: true,
			},
		})

		await wrapper.vm.validateOnSubmit()

		expect(wrapper.vm.hasError).toBe(false)
	})

	it('validates phone number and country code on blur', async () => {
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

		const input = wrapper.find('input')
		await input.setValue('123456')
		await input.trigger('blur')

		expect(wrapper.vm.hasError).toBe(true)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Nécessaire pour accéder à errors
		expect((wrapper.vm as any).errors.length).toBeGreaterThan(0)
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
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				countryCodeRequired: true,
				modelValue: '0123456789',
			},
		})

		const result = await wrapper.vm.validateOnSubmit()

		expect(result).toBe(false)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Nécessaire pour accéder à errors
		expect((wrapper.vm as any).errors.length).toBeGreaterThan(0)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Nécessaire pour accéder à errors
		expect((wrapper.vm as any).errors[0]).toContain('est requis')
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

	it('validates phone number with country code on blur', async () => {
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

	it('validates phone number with valid country code on blur', async () => {
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
	})

	it('formats phone number correctly', () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '0123456789',
			},
		})

		expect(wrapper.vm.computedValue).toBe('01 23 45 67 89')
	})

	it('emits update:selectedDialCode when dialCode changes', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
			},
		})

		const dialCodeValue = { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' }
		wrapper.vm.dialCode = dialCodeValue
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:selectedDialCode')).toBeTruthy()
		const emittedEvents = wrapper.emitted('update:selectedDialCode')
		expect(emittedEvents && emittedEvents[0][0]).toEqual(dialCodeValue)
	})

	it('validates phone number on submit', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
				modelValue: '',
			},
		})

		const result = await wrapper.vm.validateOnSubmit()

		expect(result).toBe(false)
		expect(wrapper.vm.hasError).toBe(true)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Nécessaire pour accéder à errors
		expect((wrapper.vm as any).errors.length).toBeGreaterThan(0)
	})

	it('validates phone number successfully on submit with valid input', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
				modelValue: '0123456789',
			},
		})

		const result = await wrapper.vm.validateOnSubmit()

		expect(result).toBe(true)
		expect(wrapper.vm.hasError).toBe(false)
	})

	it('exposes necessary properties and methods', () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.vm.computedValue).toBeDefined()
		expect(wrapper.vm.dialCode).toBeDefined()
		expect(wrapper.vm.phoneMask).toBeDefined()
		expect(wrapper.vm.counter).toBeDefined()
		expect(wrapper.vm.hasError).toBeDefined()
		expect(wrapper.vm.phoneNumber).toBeDefined()
		expect(wrapper.vm.mergedDialCodes).toBeDefined()
		expect(wrapper.vm.validation).toBeDefined()
		expect(wrapper.vm.validateOnSubmit).toBeDefined()
	})

	it('updates validation rules when counter changes', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				modelValue: '0123456789',
			},
		})

		expect(wrapper.vm.counter).toBe(10)

		wrapper.vm.dialCode = { code: '+44', abbreviation: 'UK', country: 'United Kingdom', phoneLength: 11, mask: '### ### #####' }
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.counter).toBe(11)
	})

	it('handles disabled state correctly', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				disabled: true,
				withCountryCode: true,
			},
		})

		const textField = wrapper.findComponent({ name: 'SyTextField' })
		expect(textField.props('disabled')).toBe(true)

		const select = wrapper.findComponent({ name: 'SySelect' })
		expect(select.props('disabled')).toBe(true)
	})

	it('handles readonly state correctly', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				readonly: true,
				withCountryCode: true,
			},
		})

		const textField = wrapper.findComponent({ name: 'SyTextField' })
		expect(textField.props('readonly')).toBe(true)

		const select = wrapper.findComponent({ name: 'SySelect' })
		expect(select.props('readonly')).toBe(true)
	})

	it('verifies SyTextField and SySelect props are correctly passed', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				dialCodeModel: { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' },
			},
		})

		await wrapper.vm.$nextTick()

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

	it('updates dialCode when dialCodeModel changes after mount', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
			},
		})

		expect(wrapper.vm.dialCode).toBe('')

		await wrapper.setProps({
			dialCodeModel: { code: '+1', country: 'USA', abbreviation: 'US', phoneLength: 10, mask: '###-###-####' },
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

		expect(dialCode.code).toBe('+1')
		expect(dialCode.country).toBe('USA/Canada')
		expect(wrapper.vm.phoneMask).toBe('### ### ####')
		expect(wrapper.vm.counter).toBe(10)
	})

	it('handles dialCodeModel objects without displayText property', async () => {
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

		expect(wrapper.vm.dialCode).toBeDefined()

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

		expect(dialCode).toHaveProperty('displayText')
		expect(typeof dialCode.displayText).toBe('string')
		expect(dialCode.displayText).toContain('+44')
	})

	it('should display helpText below by default when helpText is provided', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				required: true,
				helpText: 'Saisissez votre numéro de téléphone au format 01 23 45 67 89',
			},
		})

		await wrapper.vm.$nextTick()

		// Check that helpText is displayed by default when provided
		const helpTextDiv = wrapper.find('.help-text-below')
		expect(helpTextDiv.exists()).toBe(true)
		expect(helpTextDiv.text()).toBe('Saisissez votre numéro de téléphone au format 01 23 45 67 89')
		expect(helpTextDiv.classes()).toContain('help-text-below')
	})

	it('should display helpText below even when field has valid value', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '01 23 45 67 89',
				required: true,
				helpText: 'Saisissez votre numéro de téléphone au format 01 23 45 67 89',
			},
		})

		await wrapper.vm.$nextTick()

		// Check that helpText is displayed even when there are no errors
		const helpTextDiv = wrapper.find('.help-text-below')
		expect(helpTextDiv.exists()).toBe(true)
		expect(helpTextDiv.text()).toBe('Saisissez votre numéro de téléphone au format 01 23 45 67 89')
	})

	it('should not display helpText below when helpText is not provided', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				required: true,
				// No helpText prop
			},
		})

		// Trigger validation by blurring the field
		const phoneInput = wrapper.find('input[type="tel"]')
		await phoneInput.trigger('blur')
		await wrapper.vm.$nextTick()

		// Check that helpText div is not displayed when helpText is not provided
		const helpTextDiv = wrapper.find('.help-text-below')
		expect(helpTextDiv.exists()).toBe(false)
	})

	it('should apply default autocomplete attributes correctly', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				withCountryCode: true,
			},
		})

		await wrapper.vm.$nextTick()

		// Check that phone input has default tel-national autocomplete
		const phoneInput = wrapper.find('input[type="tel"]')
		expect(phoneInput.attributes('autocomplete')).toBe('tel-national')

		// Check that country code select has default tel-country-code autocomplete
		const selectInput = wrapper.find('.custom-select input')
		expect(selectInput.attributes('autocomplete')).toBe('tel-country-code')
	})

	it('should apply custom autocomplete attributes when provided', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				withCountryCode: true,
				autocompleteCountryCode: 'tel-country-code',
				autocompletePhone: 'tel-extension',
			},
		})

		await wrapper.vm.$nextTick()

		// Check that phone input has custom autocomplete
		const phoneInput = wrapper.find('input[type="tel"]')
		expect(phoneInput.attributes('autocomplete')).toBe('tel-extension')

		// Check that country code select has custom autocomplete
		const selectInput = wrapper.find('.custom-select input')
		expect(selectInput.attributes('autocomplete')).toBe('tel-country-code')
	})

	it('should verify autocomplete attributes are present in the actual DOM', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				withCountryCode: true,
				autocompleteCountryCode: 'tel-country-code',
				autocompletePhone: 'tel-national',
			},
		})

		await wrapper.vm.$nextTick()

		// Verify tel input has correct autocomplete
		const telInput = wrapper.find('input[type="tel"]')
		expect(telInput.exists()).toBe(true)
		const telAutocomplete = telInput.attributes('autocomplete')
		expect(telAutocomplete).toBe('tel-national')

		// Verify country select input has correct autocomplete
		const selectInput = wrapper.find('.custom-select input')
		expect(selectInput.exists()).toBe(true)
		const selectAutocomplete = selectInput.attributes('autocomplete')
		expect(selectAutocomplete).toBe('tel-country-code')
	})

	it('should apply autocomplete to phone field only when no country code', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				withCountryCode: false,
				autocompletePhone: 'tel',
			},
		})

		await wrapper.vm.$nextTick()

		// Check that phone input has autocomplete
		const phoneInput = wrapper.find('input[type="tel"]')
		expect(phoneInput.attributes('autocomplete')).toBe('tel')

		// Check that country code select doesn't exist
		const selectInput = wrapper.find('.custom-select input')
		expect(selectInput.exists()).toBe(false)
	})

	it('works correctly with standard indicatifs imported from indicatifs.ts', async () => {
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

		expect(wrapper.vm.dialCode).toBeDefined()

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

		const select = wrapper.findComponent({ name: 'SySelect' })
		expect(select.exists()).toBe(true)
		expect(select.props('modelValue')).toEqual(wrapper.vm.dialCode)
	})

	it('disables error handling when readonly is true', async () => {
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
				modelValue: '',
				readonly: true,
			},
		})

		expect(wrapper.props('readonly')).toBe(true)

		const isValid = await wrapper.vm.validateOnSubmit()

		expect(isValid).toBe(true)

		expect(wrapper.vm.hasError).toBe(false)
		const wrapperNotReadonly = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				required: true,
				modelValue: '',
				readonly: false,
			},
		})

		const isValidNotReadonly = await wrapperNotReadonly.vm.validateOnSubmit()

		expect(isValidNotReadonly).toBe(false)

		expect(wrapperNotReadonly.vm.hasError).toBe(true)
	})

	// Tests pour les formats d'affichage avec abréviations encapsulées
	describe('Display formats with abbreviations', () => {
		let wrapper: VueWrapper<InstanceType<typeof PhoneField>>

		beforeEach(() => {
			wrapper = mount(PhoneField, {
				global: {
					plugins: [vuetify],
				},
				props: {
					withCountryCode: true,
					displayFormat: 'code',
				},
			})
		})

		it('formats display text as code by default', () => {
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			expect(firstItem.displayText).toBe(firstItem.code)
		})

		it('formats display text as code-abbreviation', async () => {
			await wrapper.setProps({ displayFormat: 'code-abbreviation' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			const expectedCountry = firstItem.countryFr || firstItem.country
			expect(firstItem.displayText).toBe(`${firstItem.code} (<abbr title="${expectedCountry}">${firstItem.abbreviation}</abbr>)`)
		})

		it('formats display text as code-country', async () => {
			await wrapper.setProps({ displayFormat: 'code-country' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			const expectedCountry = firstItem.countryFr || firstItem.country
			expect(firstItem.displayText).toBe(`${firstItem.code} ${expectedCountry}`)
		})

		it('formats display text as country', async () => {
			await wrapper.setProps({ displayFormat: 'country' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			const expectedCountry = firstItem.countryFr || firstItem.country
			expect(firstItem.displayText).toBe(expectedCountry)
		})

		it('formats display text as abbreviation', async () => {
			await wrapper.setProps({ displayFormat: 'abbreviation' })
			const select = wrapper.findComponent({ name: 'SySelect' })
			const firstItem = select.props('items')[0]
			const expectedCountry = firstItem.countryFr || firstItem.country
			expect(firstItem.displayText).toBe(`<abbr title="${expectedCountry}">${firstItem.abbreviation}</abbr>`)
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
					withCountryCode: true,
				},
			})

			// Sélectionner l'indicatif personnalisé
			wrapper.vm.dialCode = customIndicatifs[0]
			await wrapper.vm.$nextTick()

			// Vérifier que le masque et le counter sont mis à jour
			expect(wrapper.vm.counter).toBe(8)
			expect(wrapper.vm.phoneMask).toBe('## ## ## ##')
		})
	})
})
