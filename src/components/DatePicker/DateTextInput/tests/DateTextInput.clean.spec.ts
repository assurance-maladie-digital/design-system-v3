import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DateTextInput from '../DateTextInput.vue'
import SyTextField from '../../../Customs/SyTextField/SyTextField.vue'

describe('DateTextInput.clean', () => {
	const mountComponent = (props: Record<string, unknown> = {}) => mount(DateTextInput, {
		props,
	})

	it('renders a single-date text field by default', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
	})

	it('emits update:model-value with the typed date in single mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0][0]).toBe('01/01/2025')
	})

	it('formats modelValue according to dateFormatReturn in single mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0][0]).toBe('2025-01-01')
	})

	it('validates on submit for required single date', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			required: true,
		})

		const emptyResult = await wrapper.vm.validateOnSubmit()
		expect(emptyResult).toBe(false)

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const validResult = await wrapper.vm.validateOnSubmit()
		expect(validResult).toBe(true)
	})

	it('emits a range model for a valid date range', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025 - 10/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const last = emitted && emitted[emitted.length - 1][0]
		expect(Array.isArray(last)).toBe(true)
		if (Array.isArray(last)) {
			expect(last[0]).toBe('01/01/2025')
			expect(last[1]).toBe('10/01/2025')
		}
	})

	it('keeps the range separator when only the start date is entered', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await wrapper.vm.$nextTick()
		await flushPromises()
		await wrapper.vm.$nextTick()

		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('01/01/2025 - ')
	})

	it('shows an error message for invalid single date format on blur', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			required: false,
		})

		const input = wrapper.find('input')
		await input.setValue('32/13/2025')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('shows required error message when empty and required in single mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('shows an error when end date is before start date in range mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await input.setValue('10/01/2025 - 01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('reset clears input value and validation messages', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		// Sanity check: should be valid before reset
		let textField = wrapper.findComponent(SyTextField)
		let errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBe(0)

		// Now reset the component
		wrapper.vm.reset()
		await flushPromises()

		// Input should be cleared and no errors present
		textField = wrapper.findComponent(SyTextField)
		errorMessages = textField.props('errorMessages') as string[] | undefined
		expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
		expect(errorMessages && errorMessages.length).toBe(0)
	})

	it('emits date-selected when a valid single date is selected', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await flushPromises()
		await wrapper.vm.$nextTick()

		input.element.value = '01/01/2025'
		await input.trigger('input')
		await input.trigger('blur')
		await flushPromises()

		const selected = wrapper.emitted('date-selected')
		expect(selected).toBeTruthy()
	})

	it('emits focus and blur events from the text field', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')

		expect(wrapper.emitted('focus')).toBeTruthy()
		expect(wrapper.emitted('blur')).toBeTruthy()
	})

	it('still shows validation errors when readonly with invalid input', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			readonly: true,
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('32/13/2025')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('formats range modelValue according to dateFormatReturn in range mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025 - 10/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const last = emitted && emitted[emitted.length - 1][0]
		expect(Array.isArray(last)).toBe(true)
		if (Array.isArray(last)) {
			expect(last[0]).toBe('2025-01-01')
			expect(last[1]).toBe('2025-01-10')
		}
	})

	it('applies pasted single date into the input', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		const clipboardData = {
			getData: () => '01/01/2025',
		}

		await input.trigger('paste', { clipboardData })
		await input.trigger('input')
		await flushPromises()

		expect(input.element.value).toContain('01/01/2025')
	})

	it('does not validate on blur when isValidateOnBlur is false but validateOnSubmit still applies', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			required: true,
			isValidateOnBlur: false,
		})

		const input = wrapper.find('input')
		await input.setValue('')
		await input.trigger('blur')
		await flushPromises()

		// Aucun message d'erreur affiché au blur
		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBe(0)

		// Mais validateOnSubmit tient compte du required
		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
	})

	it('restores single date from modelValue when disabled and input is cleared', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			modelValue: '01/01/2025',
			disabled: true,
		})

		const input = wrapper.find('input')
		await flushPromises()

		// Piloter directement la valeur interne pour déclencher le watcher disabled
		const vm = wrapper.vm as unknown as { inputValue: string }
		vm.inputValue = '01/01/2025'
		await flushPromises()
		vm.inputValue = ''
		await flushPromises()

		// Le watcher doit resynchroniser depuis modelValue
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')
	})

	it('restores range from modelValue when disabled and input is cleared', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
			modelValue: ['01/01/2025', '10/01/2025'],
			disabled: true,
		})

		const input = wrapper.find('input')
		await flushPromises()

		const vm = wrapper.vm as unknown as { inputValue: string }
		vm.inputValue = '01/01/2025 - 10/01/2025'
		await flushPromises()
		vm.inputValue = ''
		await flushPromises()

		expect((input.element as HTMLInputElement).value).toBe('01/01/2025 - 10/01/2025')
	})
})
