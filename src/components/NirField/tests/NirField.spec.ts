import { mount } from '@vue/test-utils'
import NirField from '../NirField.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

describe('NirField.vue', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	let wrapper: any

	beforeEach(() => {
		wrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				required: true,
			},
		})
	})

	it('renders correctly', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.vd-number-field').exists()).toBe(true)
		expect(wrapper.find('.vd-key-field').exists()).toBe(true)
	})

	it('displays error message for invalid NIR length', async () => {
		const numberField = wrapper.find('.vd-number-field input')
		await numberField.setValue('123') // Invalid length
		await numberField.trigger('blur')
		expect(wrapper.find('.v-messages__message').text()).toContain('Le numéro de sécurité sociale doit contenir 13 caractères.')
	})

	it('validates the NIR field successfully', async () => {
		const numberField = wrapper.find('.vd-number-field input')
		await numberField.setValue('2940375120005') // Valid NIR length
		expect(wrapper.find('.v-messages__message--success').exists()).toBe(true)
	})

	it('displays error message for invalid key length', async () => {
		const numberField = wrapper.find('.vd-number-field input')
		await numberField.setValue('2940375120005') // Valid NIR length
		const keyField = wrapper.find('.vd-key-field input')
		await keyField.setValue('1') // Invalid length
		await keyField.trigger('blur')
		expect(wrapper.find('.v-messages__message').text()).toContain('La clé du numéro de sécurité sociale doit contenir 2 caractères.')
	})

	it('validates the key field successfully', async () => {
		const numberField = wrapper.find('.vd-number-field input')
		const keyField = wrapper.find('.vd-key-field input')
		await numberField.setValue('2940375120005')
		await keyField.setValue('91')
		expect(wrapper.find('.v-messages__message--success').exists()).toBe(true)
	})

	it('hides the key field when displayKey is false', async () => {
		await wrapper.setProps({ displayKey: false })
		expect(wrapper.find('.vd-key-field').exists()).toBe(false)
	})

	it('calls validateOnSubmit and returns true if no errors', async () => {
		const numberField = wrapper.find('.vd-number-field input')
		const keyField = wrapper.find('.vd-key-field input')

		await numberField.setValue('2940375120005')
		await keyField.setValue('91')

		await wrapper.vm.$nextTick()

		wrapper.vm.validateFields()

		const isValid = wrapper.vm.validateOnSubmit()

		expect(isValid).toBe(true)
		expect(wrapper.vm.errors.length).toBe(0)
	})
	it('applies custom key rules when provided', async () => {
		const customKeyRules = [
			{
				type: 'custom',
				options: {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
					validate: (value: any) => value === '91',
					message: 'Custom key validation failed.',
					successMessage: 'Custom key validation passed.',
				},
			},
		]

		wrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '',
				required: true,
				customKeyRules,
			},
		})
		const numberField = wrapper.find('.vd-number-field input')
		const keyField = wrapper.find('.vd-key-field input')
		await numberField.setValue('2940375120005')
		await keyField.setValue('91')

		await wrapper.vm.$nextTick()

		expect(wrapper.vm.errors.length).toBe(0)
		expect(wrapper.vm.successes).toContain('Custom key validation passed.')

		await keyField.setValue('11')
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.errors).toContain('Custom key validation failed.')
	})
})
