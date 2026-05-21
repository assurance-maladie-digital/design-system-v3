import { mount as baseMount, VueWrapper } from '@vue/test-utils'
import PhoneField from '../PhoneField.vue'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { indicatifs } from '../indicatifs'
import type { ComponentPublicInstance } from 'vue'
import { locales } from '../locales'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

interface PhoneFieldInstance extends ComponentPublicInstance {
	phoneNumber: string
	dialCode: unknown
	usedIndicatif: { mask: string, phoneLength: number }
	dialCodeList: unknown[]
	hasError: boolean
	errors: string[]
	validation: {
		clearValidation: () => void
		errors: string[]
		warnings: string[]
		successes: string[]
		hasError: boolean
		hasWarning: boolean
		hasSuccess: boolean
	}
	validateOnSubmit: () => Promise<boolean>
	phoneMask: string
	clearValidation: () => void
}

const mount = (component: unknown, options?: Record<string, unknown>) => baseMount(component as never, options as never) as unknown as VueWrapper<PhoneFieldInstance>

describe('PhoneField', () => {
	afterEach(() => {
		vi.clearAllMocks()
		document.body.innerHTML = ''
	})
	it('renders correctly with default props', () => {
		const wrapper = mount(PhoneField)
		expect(wrapper.exists()).toBe(true)
	})

	it('emits update:modelValue and change events on phone input', async () => {
		const wrapper = mount(PhoneField)
		const input = wrapper.find('input')
		await input.setValue('1234567890')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		await input.trigger('blur')
		expect(wrapper.emitted('change')).toBeTruthy()
	})

	it('trims input to the expected phoneLength', async () => {
		const wrapper = mount(PhoneField, {
			props: {
				withCountryCode: true,
				modelValue: '',
			},
		})

		wrapper.vm.dialCode = { code: '+27', abbreviation: 'ZA', country: 'South Africa', phoneLength: 9, mask: '### ### ###' }
		await wrapper.vm.$nextTick()

		const textField = wrapper.findComponent({ name: 'SyTextField' })
		const input = textField.find('input')
		await input.setValue('01234567890')
		await wrapper.vm.$nextTick()

		const lastModelValueEmission = wrapper.emitted('update:modelValue')?.at(-1)?.[0]
		expect(typeof lastModelValueEmission).toBe('string')
		expect(String(lastModelValueEmission).replace(/\D/g, '').length).toBe(9)
	})

	it('keeps counter max aligned with dial code phoneLength (+27 => 9)', async () => {
		const wrapper = mount(PhoneField, {
			props: {
				withCountryCode: true,
				modelValue: '',
			},
		})

		wrapper.vm.dialCode = { code: '+27', abbreviation: 'ZA', country: 'South Africa', phoneLength: 9, mask: '### ### ###' }
		await wrapper.vm.$nextTick()

		const textField = wrapper.findComponent({ name: 'SyTextField' })
		expect(textField.props('counter')).toBe(9)
	})

	it('applies default phone mask correctly', async () => {
		const wrapper = mount(PhoneField, {
			props: { modelValue: '0619123456' },
		})
		await wrapper.vm.$nextTick()
		expect(wrapper.find('input').element.value).toBe('06 19 12 34 56')
	})

	it('renders SySelect when withCountryCode is true', () => {
		const wrapper = mount(PhoneField, {
			props: { withCountryCode: true },
		})
		expect(wrapper.findComponent({ name: 'SySelect' }).exists()).toBe(true)
	})

	it('updates phone mask and counter when dialCode changes', async () => {
		const wrapper = mount(PhoneField, {
			props: { withCountryCode: true },
		})
		wrapper.vm.dialCode = { code: '+1', phoneLength: 10, mask: '###-###-####' }
		await wrapper.vm.$nextTick()
		// dialCode is normalized against the canonical indicatifs list by code
		expect(wrapper.vm.usedIndicatif.mask).toBe('### ### ####')
		expect(wrapper.vm.usedIndicatif.phoneLength).toBe(10)
	})

	it('uses only custom indicatifs when useCustomIndicatifsOnly is true', async () => {
		const customIndicatifs = [{ code: '+99', abbreviation: 'XX', country: 'Testland', phoneLength: 10, displayText: '+99' }]
		const wrapper = mount(PhoneField, {
			props: {
				useCustomIndicatifsOnly: true,
				customIndicatifs,
			},
		})

		expect(wrapper.vm.dialCodeList).toEqual(customIndicatifs.map(ind => expect.objectContaining(ind)))
	})

	it('renders VTextField with outlined variant when outlined prop is true', () => {
		const wrapper = mount(PhoneField, {
			props: {
				outlined: true,
			},
		})

		const textField = wrapper.findComponent({ name: 'VTextField' })
		expect(textField.props('variant')).toBe('outlined')
	})

	it('renders VTextField with underlined variant when outlined prop is false', () => {
		const wrapper = mount(PhoneField, {
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

	it('formats phone number correctly', async () => {
		const wrapper = mount(PhoneField, {
			props: {
				modelValue: '0123456789',
			},
		})
		await wrapper.vm.$nextTick()
		const input = wrapper.find('input')
		expect(input.element.value).toBe('01 23 45 67 89')
	})

	it('emits update:dialCodeModel when dialCode changes', async () => {
		const wrapper = mount(PhoneField, {
			props: {
				withCountryCode: true,
			},
		})

		const dialCodeValue = { code: '+34', abbreviation: 'ES', country: 'Spain', phoneLength: 9, mask: '### ### ###' }
		wrapper.vm.dialCode = dialCodeValue
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted('update:dialCodeModel')).toBeTruthy()
		const emittedEvents = wrapper.emitted('update:dialCodeModel')
		const lastEmitted = emittedEvents && emittedEvents[emittedEvents.length - 1]?.[0]
		expect(lastEmitted).toHaveProperty('code', dialCodeValue.code)
	})

	it('exposes necessary properties and methods', () => {
		const wrapper = mount(PhoneField)

		expect(wrapper.vm.dialCode).toBeDefined()
		expect(wrapper.vm.phoneMask).toBeDefined()
		expect(wrapper.vm.phoneNumber).toBeDefined()
		expect(wrapper.vm.validation).toBeDefined()
		expect(wrapper.vm.validateOnSubmit).toBeDefined()
	})

	it('updates validation rules when counter changes', async () => {
		const wrapper = mount(PhoneField, {
			props: {
				withCountryCode: true,
				modelValue: '0123456789',
			},
		})

		expect(wrapper.findComponent({ name: 'SyTextField' }).props('counter')).toBe(10)
		await wrapper.setProps({
			dialCodeModel: { code: '+44', abbreviation: 'UK', country: 'United Kingdom', phoneLength: 11, mask: '### ### #####' },
		})
		await wrapper.vm.$nextTick()

		// In the indicatifs list, +44 is associed with phoneLength 10
		expect(wrapper.findComponent({ name: 'SyTextField' }).props('counter')).toBe(10)
	})

	it('handles disabled state correctly', async () => {
		const wrapper = mount(PhoneField, {
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
			props: {
				withCountryCode: true,
				dialCodeModel: { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' },
			},
		})

		const phoneInput = wrapper.find<HTMLInputElement>('input[type="tel"]')
		await phoneInput.setValue('0123456789')
		expect(phoneInput.element.value).toBe('01 23 45 67 89')
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
			props: {
				withCountryCode: true,
			},
		})

		// France est sélectionnée par défaut quand withCountryCode=true
		expect(wrapper.vm.usedIndicatif).toMatchObject({ code: '+33' })

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
		expect(wrapper.vm.usedIndicatif.mask).toBe('### ### ####')
		expect(wrapper.vm.usedIndicatif.phoneLength).toBe(10)
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
		const selectInput = wrapper.find('.dial-code-select input')
		expect(selectInput.attributes('autocomplete')).toBe('tel-country-code')
	})

	it('should apply custom autocomplete attributes when provided', async () => {
		const wrapper = mount(PhoneField, {
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
		const selectInput = wrapper.find('.dial-code-select input')
		expect(selectInput.attributes('autocomplete')).toBe('tel-country-code')
	})

	it('should verify autocomplete attributes are present in the actual DOM', async () => {
		const wrapper = mount(PhoneField, {
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
		const selectInput = wrapper.find('.dial-code-select input')
		expect(selectInput.exists()).toBe(true)
		const selectAutocomplete = selectInput.attributes('autocomplete')
		expect(selectAutocomplete).toBe('tel-country-code')
	})

	it('should apply autocomplete to phone field only when no country code', async () => {
		const wrapper = mount(PhoneField, {
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
		const selectInput = wrapper.find('.dial-code-select input')
		expect(selectInput.exists()).toBe(false)
	})

	it('works correctly with standard indicatifs imported from indicatifs.ts', async () => {
		const franceIndicatif = indicatifs.find(ind => ind.country === 'France')
		expect(franceIndicatif).toBeDefined()

		const wrapper = mount(PhoneField, {
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

	// Tests pour les formats d'affichage avec abréviations encapsulées
	describe('Display formats with abbreviations', () => {
		let wrapper: VueWrapper<PhoneFieldInstance>

		beforeEach(() => {
			wrapper = mount(PhoneField, {
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
			expect(wrapper.vm.usedIndicatif.mask).toBeDefined()
			// Vérifier que le counter est défini selon la phoneLength
			expect(wrapper.vm.usedIndicatif.phoneLength).toBeDefined()
		})

		it('initializes with a default dialCode string', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					withCountryCode: true,
					dialCodeModel: '+33',
				},
			})

			await wrapper.vm.$nextTick()

			// Vérifier que le dialCode est correctement initialisé
			expect(wrapper.vm.dialCode).toEqual(expect.objectContaining({ code: '+33' }))
		})
	})

	// Tests de validation
	describe('Validation', () => {
		it('cleans spaces from phone number before validation', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '01 23 45 67 89',
				},
			})

			const isValid = await wrapper.vm.validateOnSubmit()
			expect(isValid).toBe(true)
			expect(wrapper.vm.hasError).toBe(false)
		})

		it('validates phone number and country code on blur', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '12345',
					isValidateOnBlur: true,
				},
			})

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')
			await wrapper.vm.$nextTick()

			expect(wrapper.vm.hasError).toBe(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to access errors
			expect((wrapper.vm as any).errors[0]).toContain(locales.errorLength(10))
		})

		it('keeps a consistent success message before and after blur when withCountryCode is true', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					withCountryCode: true,
					isValidateOnBlur: false,
					modelValue: '',
				},
			})

			const textField = wrapper.findComponent({ name: 'SyTextField' })
			const input = textField.find('input')
			await input.setValue('0123456789')
			await wrapper.vm.$nextTick()

			const messageBeforeBlur = textField.find('.v-messages__message')
			expect(messageBeforeBlur.exists()).toBe(true)
			expect(messageBeforeBlur.text()).toBe('Le champ Numéro de téléphone sans indicatif est valide.')
			expect(messageBeforeBlur.text()).not.toBe('Le champ Numéro de téléphone est valide.')

			await input.trigger('blur')
			await wrapper.vm.$nextTick()

			const messageAfterBlur = textField.find('.v-messages__message')
			expect(messageAfterBlur.exists()).toBe(true)
			expect(messageAfterBlur.text()).toBe('Le champ Numéro de téléphone sans indicatif est valide.')
		})

		it('validates country code when countryCodeRequired is true on submit', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					withCountryCode: true,
					countryCodeRequired: true,
					modelValue: '0123456789',
				},
			})

			wrapper.vm.dialCode = ''
			await wrapper.vm.$nextTick()

			const result = await wrapper.vm.validateOnSubmit()

			expect(result).toBe(false)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to access errors
			expect((wrapper.vm as any).errors.length).toBeGreaterThan(0)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to access errors
			expect((wrapper.vm as any).errors[0]).toContain('requis')
		})

		it('validates phone number on submit', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '',
				},
			})

			const result = await wrapper.vm.validateOnSubmit()

			expect(result).toBe(false)
			expect(wrapper.vm.hasError).toBe(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to access errors
			expect((wrapper.vm as any).errors.length).toBeGreaterThan(0)
		})

		it('validates phone number successfully on submit with valid input', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '0123456789',
				},
			})

			const result = await wrapper.vm.validateOnSubmit()

			expect(result).toBe(true)
			expect(wrapper.vm.hasError).toBe(false)
		})

		it('disables error handling when readonly is true', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '',
					readonly: true,
				},
			})

			const isValid = await wrapper.vm.validateOnSubmit()

			expect(isValid).toBe(true)
			expect(wrapper.vm.hasError).toBe(false)

			const wrapperNotReadonly = mount(PhoneField, {
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

		it('displays error messages by default when validation fails', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '',
					isValidateOnBlur: true,
				},
			})

			await wrapper.vm.validateOnSubmit()

			expect(wrapper.vm.hasError).toBe(true)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			expect((wrapper.vm as any).errors.length).toBeGreaterThan(0)

			const textField = wrapper.findComponent({ name: 'SyTextField' })
			expect(textField.props('errorMessages')).toBeTruthy()
		})

		it('initializes with disableErrorHandling prop', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '',
					isValidateOnBlur: true,
					disableErrorHandling: true,
				},
			})

			expect(wrapper.vm.validation).toBeDefined()
		})

		it('validates as part of a form submission', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '',
				},
			})

			const isValid = await wrapper.vm.validateOnSubmit()
			expect(isValid).toBe(false)

			await wrapper.setProps({ modelValue: '0123456789' })
			const isValidAfterUpdate = await wrapper.vm.validateOnSubmit()
			expect(isValidAfterUpdate).toBe(true)
		})

		it('validates country code as part of form submission', async () => {
			const wrapper = mount(PhoneField, {
				props: {
					required: true,
					modelValue: '0123456789',
					withCountryCode: true,
					countryCodeRequired: true,
				},
			})

			wrapper.vm.dialCode = ''
			await wrapper.vm.$nextTick()

			const isValidWithoutCountry = await wrapper.vm.validateOnSubmit()
			expect(isValidWithoutCountry).toBe(false)

			wrapper.vm.dialCode = { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' }
			await wrapper.vm.$nextTick()

			const isValidWithCountry = await wrapper.vm.validateOnSubmit()
			expect(isValidWithCountry).toBe(true)
		})

		describe('Validation with SyForm', () => {
			it('validates as part of SyForm submission', async () => {
				const wrapper = baseMount({
					components: { PhoneField, SyForm },
					template: `
						<SyForm>
							<PhoneField with-country-code country-code-required required />
							<button type="submit">Submit</button>
						</SyForm>
					`,
				})

				const syForm = wrapper.findComponent(SyForm)
				const form = syForm.vm as { validate: () => Promise<boolean> }
				const isValidWithoutPhone = await form.validate()
				await wrapper.vm.$nextTick()

				const phoneField = wrapper.find('.phone-field')
				expect(syForm.exists()).toBe(true)
				expect(isValidWithoutPhone).toBe(false)
				expect(phoneField.classes()).toContain('error-field')

				const input = wrapper.find('input[type="tel"]')
				await input.setValue('0123456789')
				await wrapper.vm.$nextTick()

				const isValidWithPhone = await form.validate()
				await wrapper.vm.$nextTick()

				expect(isValidWithPhone).toBe(true)
				expect(phoneField.classes()).not.toContain('error-field')
			})

			it('blocks SyForm submission when a Vuetify custom rule fails', async () => {
				const wrapper = baseMount({
					components: { PhoneField, SyForm },
					setup() {
						const rules = [(v: unknown) => String(v ?? '').replace(/\D/g, '').startsWith('06') || 'Le numéro doit commencer par 06']
						return { rules }
					},
					template: `
						<SyForm>
							<PhoneField :rules="rules" use-vuetify-validation />
							<button type="submit">Submit</button>
						</SyForm>
					`,
				})

				const syForm = wrapper.findComponent(SyForm)
				const form = syForm.vm as { validate: () => Promise<boolean> }

				// A number that does not start with 06 — the Vuetify rule rejects it
				const input = wrapper.find('input[type="tel"]')
				await input.setValue('0123456789')
				await wrapper.vm.$nextTick()

				const isInvalid = await form.validate()
				await wrapper.vm.$nextTick()

				expect(isInvalid).toBe(false)
				expect(wrapper.find('.phone-field').classes()).toContain('error-field')

				// Fix the value so the Vuetify rule passes
				await input.setValue('0612345678')
				await wrapper.vm.$nextTick()

				const isValid = await form.validate()
				await wrapper.vm.$nextTick()

				expect(isValid).toBe(true)
				expect(wrapper.find('.phone-field').classes()).not.toContain('error-field')
			})

			it('passes SyForm submission when all Vuetify rules are satisfied', async () => {
				const wrapper = baseMount({
					components: { PhoneField, SyForm },
					setup() {
						const rules = [
							(v: unknown) => !!v || 'Champ requis',
							(v: unknown) => String(v ?? '').replace(/\D/g, '').length === 10 || 'Le numéro doit contenir 10 chiffres',
						]
						return { rules }
					},
					template: `
						<SyForm>
							<PhoneField :rules="rules" use-vuetify-validation />
							<button type="submit">Submit</button>
						</SyForm>
					`,
				})

				const syForm = wrapper.findComponent(SyForm)
				const form = syForm.vm as { validate: () => Promise<boolean> }

				const input = wrapper.find('input[type="tel"]')
				await input.setValue('0612345678')
				await wrapper.vm.$nextTick()

				const isValid = await form.validate()
				await wrapper.vm.$nextTick()

				expect(isValid).toBe(true)
				expect(wrapper.find('.phone-field').classes()).not.toContain('error-field')
			})
		})
	})

	// Tests pour la gestion des indicatifs personnalisés
	describe('Custom indicatifs', () => {
		it('merges custom indicatifs with standard ones by default', () => {
			const customIndicatifs = [{ code: '+999', abbreviation: 'XX', country: 'Test Country', phoneLength: 8, mask: '## ## ## ##' }]
			const wrapper = mount(PhoneField, {
				props: {
					customIndicatifs,
					withCountryCode: true,
				},
			})

			// Vérifier que les indicatifs personnalisés sont ajoutés aux indicatifs standards
			expect(wrapper.vm.dialCodeList.length).toBe(indicatifs.length + customIndicatifs.length)
			expect(wrapper.vm.dialCodeList).toContainEqual(expect.objectContaining(customIndicatifs[0]))
		})

		it('uses only custom indicatifs when useCustomIndicatifsOnly is true', () => {
			const customIndicatifs = [{ code: '+999', abbreviation: 'XX', country: 'Test Country', phoneLength: 8, mask: '## ## ## ##' }]
			const wrapper = mount(PhoneField, {
				props: {
					customIndicatifs,
					useCustomIndicatifsOnly: true,
					withCountryCode: true,
				},
			})

			// Vérifier que seuls les indicatifs personnalisés sont utilisés
			expect(wrapper.vm.dialCodeList.length).toBe(customIndicatifs.length)
			expect(wrapper.vm.dialCodeList).toEqual(expect.arrayContaining(customIndicatifs.map(ind => expect.objectContaining(ind))))
		})

		it('updates phone mask and counter based on selected custom indicatif', async () => {
			const customIndicatifs = [{ code: '+999', abbreviation: 'XX', country: 'Test Country', phoneLength: 8, mask: '## ## ## ##' }]
			const wrapper = mount(PhoneField, {
				props: {
					customIndicatifs,
					withCountryCode: true,
				},
			})

			// Sélectionner l'indicatif personnalisé
			wrapper.vm.dialCode = customIndicatifs[0]!
			await wrapper.vm.$nextTick()

			// Vérifier que le masque et le counter sont mis à jour
			expect(wrapper.vm.usedIndicatif.phoneLength).toBe(8)
			expect(wrapper.vm.usedIndicatif.mask).toBe('## ## ## ##')
		})
	})

	describe('Fieldset rendering', () => {
		it('renders with fieldset and legend by default', () => {
			const wrapper = mount(PhoneField, {
				props: {
					// withoutFieldset par défaut est false
				},
			})

			// Vérifier que le composant utilise un fieldset
			const fieldset = wrapper.find('fieldset')
			expect(fieldset.exists()).toBe(true)
			expect(fieldset.classes()).toContain('phone-field-fieldset')

			// Vérifier que le legend existe
			const legend = wrapper.find('legend')
			expect(legend.exists()).toBe(true)
			expect(legend.classes()).toContain('phone-field-legend')
		})

		it('renders without fieldset and legend when withoutFieldset is true', () => {
			const wrapper = mount(PhoneField, {
				props: {
					withoutFieldset: true,
				},
			})

			// Vérifier que le composant n'utilise pas de fieldset
			const fieldset = wrapper.find('fieldset')
			expect(fieldset.exists()).toBe(false)

			// Vérifier que le composant utilise un div à la place
			const container = wrapper.find('div').element
			expect(container.tagName.toLowerCase()).toBe('div')

			// Vérifier que le legend n'existe pas
			const legend = wrapper.find('legend')
			expect(legend.exists()).toBe(false)
		})
	})
})
