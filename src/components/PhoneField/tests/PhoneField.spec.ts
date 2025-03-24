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
		const wrapper = mount(PhoneField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				withCountryCode: true,
				dialCodeModel: { code: '+33', abbreviation: 'FR', country: 'France', phoneLength: 10, mask: '## ## ## ## ##' },
			},
		})

		// Vérifier que le dialCode est bien un objet
		expect(typeof wrapper.vm.dialCode).toBe('object')

		// Trouver le composant SyTextField
		const textField = wrapper.findComponent({ name: 'SyTextField' })
		expect(textField.exists()).toBe(true)

		// Vérifier que les propriétés du SyTextField sont correctement définies en fonction du dialCode
		expect(wrapper.vm.phoneMask).toBe('## ## ## ## ##')
		expect(wrapper.vm.counter).toBe(10)

		// Vérifier que le SyTextField reçoit les bonnes propriétés
		expect(textField.props('counter')).toBe(10)

		// Vérifier que le SySelect est présent et reçoit l'objet dialCode
		const select = wrapper.findComponent({ name: 'SySelect' })
		expect(select.exists()).toBe(true)
		expect(select.props('returnObject')).toBe(true)

		// Vérifier que l'objet dialCode est correctement passé au SySelect via v-model
		expect(wrapper.vm.dialCode).toEqual({
			code: '+33',
			abbreviation: 'FR',
			country: 'France',
			phoneLength: 10,
			mask: '## ## ## ## ##',
		})
	})
})
