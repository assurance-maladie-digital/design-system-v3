import { mount } from '@vue/test-utils'
import NirField from '../NirField.vue'
import { describe, it, expect, beforeEach } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { useValidation } from '@/composables/validation/useValidation'

const vuetify = createVuetify({
	components,
	directives,
})

describe('NirField.vue', () => {
	let wrapper: ReturnType<typeof mount<typeof NirField & {
		numberValidation: ReturnType<typeof useValidation>
		keyValidation: ReturnType<typeof useValidation>
	}>>

	beforeEach(() => {
		wrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: undefined,
				required: true,
				showSuccessMessages: true,
				outlined: true,
			},
		})
	})

	it('renders correctly', () => {
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('.number-field').exists()).toBe(true)
		expect(wrapper.find('.key-field').exists()).toBe(true)
	})

	it('displays error message for invalid NIR length', async () => {
		await wrapper.find('.number-field input').setValue('123')
		await wrapper.find('.number-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.numberValidation.errors.value[0]).toBe('Le numéro de sécurité sociale est invalide.')
	})

	it('validates the NIR field successfully', async () => {
		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.find('.number-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.numberValidation.successes.value).toContain('Le numéro de sécurité sociale est valide.')
	})

	it('displays error message for invalid key length', async () => {
		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.find('.key-field input').setValue('1')
		await wrapper.find('.key-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.keyValidation.errors.value[0]).toBe('Le numéro de sécurité sociale est invalide.')
	})

	it('validates the key field successfully', async () => {
		await wrapper.find('.number-field input').setValue('2940375120005')
		await wrapper.find('.key-field input').setValue('91')
		await wrapper.find('.key-field input').trigger('blur')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.keyValidation.successes.value).toContain('Le numéro de sécurité sociale est valide.')
	})

	it('hides the key field when displayKey is false', async () => {
		await wrapper.setProps({ displayKey: false })
		expect(wrapper.find('.key-field').exists()).toBe(false)
	})

	it('calls validateOnSubmit and returns true if no errors', async () => {
		wrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: undefined,
				required: false,
				outlined: true,
			},
		})

		const numberField = wrapper.find('.number-field input')
		await numberField.setValue('2940375120005')
		await numberField.trigger('blur')

		await wrapper.vm.$nextTick()
		const isValid = await wrapper.vm.validateOnSubmit()

		expect(isValid).toBe(true)
	})

	it('applies custom key rules when provided', async () => {
		const customKeyRules = [{
			type: 'custom',
			options: {
				validate: (value: string) => value === '91',
				message: 'Custom key validation failed.',
				successMessage: 'Custom key validation passed.',
				fieldIdentifier: 'clé',
			},
		}]

		wrapper = mount(NirField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: undefined,
				customKeyRules,
				showSuccessMessages: true,
				outlined: true,
			},
		})

		const numberField = wrapper.find('.number-field input')
		const keyField = wrapper.find('.key-field input')
		await numberField.setValue('2940375120005')
		await keyField.setValue('91')
		await keyField.trigger('blur')
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.keyValidation.successes.value).toContain('Custom key validation passed.')
	})

	it('emits update:modelValue with correct format', async () => {
		const numberField = wrapper.find('.number-field input')
		const keyField = wrapper.find('.key-field input')
		await numberField.setValue('2940375120005')
		await wrapper.vm.$nextTick()
		await keyField.setValue('91')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['294037512000591'])
	})

	it('emits undefined when both fields are empty', async () => {
		const numberField = wrapper.find('.number-field input')
		const keyField = wrapper.find('.key-field input')
		await numberField.setValue('')
		await keyField.setValue('')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
	})

	it('splits modelValue correctly when provided', async () => {
		await wrapper.setProps({ modelValue: '294037512000591' })
		await wrapper.vm.$nextTick()
		const numberInput = wrapper.find('.number-field input').element as Element & { value: string }
		const keyInput = wrapper.find('.key-field input').element as Element & { value: string }
		expect(numberInput.value.replace(/\s/g, '')).toBe('2940375120005')
		expect(keyInput.value).toBe('91')
	})
})
