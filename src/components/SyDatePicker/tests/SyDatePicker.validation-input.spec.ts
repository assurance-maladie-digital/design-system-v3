import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyDatePicker from '../SyDatePicker.vue'
import type { SyDatePickerProps } from '../types'

const failingRule = {
	type: 'custom',
	options: {
		validate: () => false,
		message: 'always fails',
	},
} as const

/** Mounts SyDatePicker with its text field replaced through the `input` slot */
function mountWithCustomInputSlot(props: SyDatePickerProps) {
	return mount(SyDatePicker, {
		props,
		global: {
			components: { SyTextField },
		},
		slots: {
			input: `
				<SyTextField
					:model-value="textValue"
					v-bind="inputProps"
					:disable-error-handling="true"
					@update:model-value="value => updateTextValue(value)"
					@focus="setFocused(true)"
					@blur="setFocused(false)"
				/>
			`,
		},
	})
}

describe('SyDatePicker validation (saisie manuelle)', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('defers the error message to blur when a typed complete date violates the rule', async () => {
		const wrapper = mount(SyDatePicker, {
			props: {
				label: 'Début du projet',
				isValidateOnBlur: true,
				customRules: [failingRule],
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('25/12/2026')

		expect(wrapper.find('.v-field--error').exists()).toBe(false)

		await input.trigger('blur')

		expect(wrapper.find('.v-field--error').exists()).toBe(true)
		expect(wrapper.find('.v-input__details').text()).toBe('always fails')

		wrapper.unmount()
	})

	it('defers the required error to blur when a filled field is cleared by typing', async () => {
		const wrapper = mount(SyDatePicker, {
			props: {
				label: 'Début du projet',
				required: true,
				isValidateOnBlur: true,
				modelValue: new Date(2026, 11, 25),
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')

		expect(wrapper.find('.v-field--error').exists()).toBe(false)

		await input.trigger('blur')

		expect(wrapper.find('.v-field--error').exists()).toBe(true)

		wrapper.unmount()
	})

	it('defers the error message to blur when typing through a custom input slot', async () => {
		const wrapper = mountWithCustomInputSlot({
			label: 'Début du projet',
			required: true,
			isValidateOnBlur: true,
			modelValue: new Date(2026, 11, 25),
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('')

		expect(wrapper.find('.v-field--error').exists()).toBe(false)

		await input.trigger('blur')

		expect(wrapper.find('.v-field--error').exists()).toBe(true)

		wrapper.unmount()
	})

	it('show the error message when the typed date is incomplete', async () => {
		const wrapper = mount(SyDatePicker, {
			props: {
				label: 'Début du projet',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
						message: 'Invalid date format. Use DD/MM/YYYY.',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('25/12/20')
		await input.trigger('blur')

		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(wrapper.find('.v-field--error').exists()).toBe(true)
		expect(wrapper.find('.v-input__details').text()).toBe('Invalid date format. Use DD/MM/YYYY.')

		wrapper.unmount()
	})

	it('show the error message when the typed date is impossible', async () => {
		const wrapper = mount(SyDatePicker, {
			props: {
				label: 'Début du projet',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
						message: 'Invalid date format. Use DD/MM/YYYY.',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.setValue('32/13/2026')
		await input.trigger('blur')

		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		expect(wrapper.find('.v-field--error').exists()).toBe(true)
		expect(wrapper.find('.v-input__details').text()).toBe('Invalid date format. Use DD/MM/YYYY.')

		wrapper.unmount()
	})

	it('should not show an error message when the typed date is valid', async () => {
		const wrapper = mount(SyDatePicker, {
			props: {
				label: 'Début du projet',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
						message: 'Invalid date format. Use DD/MM/YYYY.',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('25/12/2026')
		await input.trigger('blur')
		await input.trigger('focus')

		expect(wrapper.find('.v-field--error').exists()).toBe(false)
		expect(wrapper.find('.v-input__details').text()).toBe('Format JJ/MM/AAAA')

		wrapper.unmount()
	})
})
