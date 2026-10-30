import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import SyTextArea from '../SyTextArea.vue'

describe('SyTextArea with use-vuetify-validation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('validateOn mode: input', () => {
		it('validates on input when validateOn is set to "input"', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'input',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			// First validation to make it non-pristine
			await wrapper.vm.validateOnSubmit()
			await flushPromises()

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await wrapper.vm.$nextTick()
			await flushPromises()

			expect(wrapper.vm.errors).toContain('Must be longer than 2')
		})

		it('clears error when input becomes valid with validateOn="input"', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: 'abc',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'input',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			// Start with valid value
			expect(wrapper.vm.errors).toEqual([])

			const textarea = wrapper.find('textarea')
			// Change to invalid value
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await wrapper.vm.$nextTick()
			await flushPromises()

			expect(wrapper.vm.errors).toContain('Must be longer than 2')

			// Now set valid value
			await textarea.setValue('abc')
			await wrapper.vm.$nextTick()
			await flushPromises()

			expect(wrapper.vm.errors).toEqual([])
		})
	})

	describe('validateOn mode: blur', () => {
		it('does not validate on input when validateOn is set to "blur" (before first blur)', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'blur',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			const textarea = wrapper.find('textarea')
			// Before any blur, input should not trigger validation
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await wrapper.vm.$nextTick()
			await flushPromises()

			// Should not validate on input since validateOn is 'blur' and no blur occurred yet
			expect(wrapper.vm.errors).toEqual([])
		})

		it('validates on blur when validateOn is set to "blur"', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'blur',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await textarea.trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()

			expect(wrapper.vm.errors).toContain('Must be longer than 2')
		})

		it('clears error when blur happens with valid value', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: 'abc',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'blur',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			// Start with valid value
			expect(wrapper.vm.errors).toEqual([])

			const textarea = wrapper.find('textarea')
			// Change to invalid value and blur
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await textarea.trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()

			expect(wrapper.vm.errors).toContain('Must be longer than 2')

			// Now set valid value and blur again
			await textarea.trigger('focus')
			await textarea.setValue('abc')
			await textarea.trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()

			expect(wrapper.vm.errors).toEqual([])
		})
	})

	describe('validateOn mode: submit', () => {
		it('does not validate on input or blur when validateOn is set to "submit"', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'submit',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await textarea.trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()

			// Should not show error yet since validation only happens on submit
			expect(wrapper.vm.errors).toEqual([])
		})

		it('validates on submit when validateOn is set to "submit"', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'submit',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.setValue('ab')

			// Call validateOnSubmit which triggers validation
			const isValid = await wrapper.vm.validateOnSubmit()
			await flushPromises()

			expect(isValid).toBe(false)
			expect(wrapper.vm.errors).toContain('Must be longer than 2')
		})

		it('returns true on submit with valid value when validateOn is "submit"', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: 'abc',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'submit',
					isValidateOnBlur: false,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			// With a valid initial value, validation should pass
			const isValid = await wrapper.vm.validateOnSubmit()
			await flushPromises()

			// The value is valid, so validation should pass
			expect(isValid).toBe(true)
			// Errors should be cleared
			expect(wrapper.vm.errors).toEqual([])
		})
	})

	describe('validateOn and isValidateOnBlur provided together', () => {
		it('uses validateOn when both validateOn and isValidateOnBlur are provided (input)', async () => {
			// When both are provided, validateOn should take precedence
			// According to useValidation.ts:172: computed(() => params.validateOn?.value || (params.isValidateOnBlur.value ? 'blur' : 'input'))
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'input',
					isValidateOnBlur: true,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			// First validation to make it non-pristine
			await wrapper.vm.validateOnSubmit()
			await flushPromises()

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await wrapper.vm.$nextTick()
			await flushPromises()

			// Should validate on input (not wait for blur) because validateOn takes precedence
			expect(wrapper.vm.errors).toContain('Must be longer than 2')
		})

		it('uses validateOn="blur" when both validateOn="blur" and isValidateOnBlur=true are provided', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'blur',
					isValidateOnBlur: true,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await wrapper.vm.$nextTick()
			await flushPromises()

			// Should not show error yet since validateOn is 'blur' (not input)
			expect(wrapper.vm.errors).toEqual([])

			// Need to blur to trigger validation
			await textarea.trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()

			// Now should show error after blur
			expect(wrapper.vm.errors).toContain('Must be longer than 2')
		})

		it('uses validateOn="submit" when both validateOn="submit" and isValidateOnBlur=true are provided', async () => {
			const wrapper = mount(SyTextArea, {
				props: {
					uniqueId: 'textarea-1',
					modelValue: '',
					label: 'Test Area',
					useVuetifyValidation: true,
					validateOn: 'submit',
					isValidateOnBlur: true,
					rules: [(v: string) => v.length > 2 || 'Must be longer than 2'],
				},
			})

			const textarea = wrapper.find('textarea')
			await textarea.trigger('focus')
			await textarea.setValue('ab')
			await textarea.trigger('blur')
			await wrapper.vm.$nextTick()
			await flushPromises()

			// Should not show error yet since validateOn is 'submit'
			expect(wrapper.vm.errors).toEqual([])

			const isValid = await wrapper.vm.validateOnSubmit()
			await flushPromises()

			expect(isValid).toBe(false)
			expect(wrapper.vm.errors).toContain('Must be longer than 2')
		})
	})
})
