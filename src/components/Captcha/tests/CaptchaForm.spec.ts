/* eslint-disable vue/one-component-per-file */
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import CaptchaForm from '../CaptchaForm.vue'
import { locales } from '../locales'

const SyTextFieldStub = defineComponent({
	name: 'SyTextField',
	props: {
		errorMessages: { type: Array, default: () => [] },
		hasSuccess: { type: Boolean, default: false },
		readonly: { type: Boolean, default: false },
		isClearable: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		showSuccessMessages: { type: Boolean, default: true },
		label: { type: String, default: '' },
		customRules: { type: Array, default: () => [] },
	},
	emits: ['update:modelValue'],
	template: '<div class="sy-text-field-stub" />',
})

const VSheetStub = defineComponent({
	name: 'VSheet',
	template: '<div class="v-sheet-stub"><slot /></div>',
})

describe('CaptchaForm', () => {
	it('forwards current captcha props to SyTextField', () => {
		const wrapper = mount(CaptchaForm, {
			props: {
				label: 'Captcha label',
				locales,
				state: 'rejected',
				errorMessages: ['error message'],
				success: true,
			},
			global: {
				stubs: {
					VSheet: VSheetStub,
					SyTextField: SyTextFieldStub,
				},
			},
		})

		const textField = wrapper.findComponent({ name: 'SyTextField' })

		expect(textField.exists()).toBe(true)
		expect(textField.props('errorMessages')).toEqual(['error message'])
		expect(textField.props('hasSuccess')).toBe(false)
		expect(textField.props('readonly')).toBe(true)
		expect(textField.props('isClearable')).toBe(false)
		expect(textField.props('disabled')).toBe(true)
		expect(textField.props('showSuccessMessages')).toBe(false)
		expect(textField.props('label')).toBe('Captcha label')
		expect(textField.props('customRules')).toEqual([])
	})

	it('emits update:modelValue when SyTextField updates the value', async () => {
		const wrapper = mount(CaptchaForm, {
			props: {
				label: 'Captcha label',
				locales,
				errors: [],
				success: false,
			},
			global: {
				stubs: {
					VSheet: VSheetStub,
					SyTextField: SyTextFieldStub,
				},
			},
		})

		const textField = wrapper.findComponent({ name: 'SyTextField' })
		await textField.vm.$emit('update:modelValue', 'abc123')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['abc123'])
	})
})
