import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { vuetify } from '@tests/unit/setup'
import DateTextInput from './DateTextInput.vue'
import SyTextField from '../../Customs/SyTextField/SyTextField.vue'

describe('DateTextInput.vue', () => {
	let wrapper

	beforeEach(() => {
		wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				required: true,
			},
		})
	})

	it('renders the component', () => {
		expect(wrapper.exists()).toBe(true)
	})

	it('validates required field', async () => {
		const input = wrapper.find('input')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('La date est requise.')
	})

	it('validates date format', async () => {
		const input = wrapper.find('input')
		await input.setValue('32/13/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		console.log(textField.props('errorMessages'))
		expect(textField.props('errorMessages')).toContain('Format de date invalide (DD/MM/YYYY)')
	})

	it('accepts valid date format', async () => {
		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toHaveLength(0)
		expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['01/01/2025'])
	})

	it('formats date according to dateFormatReturn', async () => {
		const wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
			},
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		expect(wrapper.emitted('update:model-value')?.[0]).toEqual(['2025-01-01'])
	})

	it('validates custom rules', async () => {
		const wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				customRules: [{
					type: 'custom',
					options: {
						validate: (value: string) => !value.includes('2024'),
						message: 'Les dates en 2024 ne sont pas autorisées',
						fieldIdentifier: 'date',
					},
				}],
			},
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2024')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Les dates en 2024 ne sont pas autorisées')
	})

	it('validates warning rules', async () => {
		const wrapper = mount(DateTextInput, {
			props: {
				modelValue: '01/01/2025',
				customWarningRules: [{
					type: 'custom',
					options: {
						validate: (value: string) => !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/2025$/.test(value),
						message: 'Les dates en 2025 ne sont pas recommandées',
						fieldIdentifier: 'date',
						isWarning: true,
					},
				}],
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Force validation by triggering a blur event
		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick() // Double nextTick to ensure updates are completed
		// We can also force validation manually
		await wrapper.vm.validateOnSubmit()
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		const warningMessages = textField.props('warningMessages') || []
		// Check that the warning message is present
		expect(warningMessages.length).toBeGreaterThan(0)
		// The actual message starts with "Attention:"
		expect(warningMessages[0]).toContain('Attention :')
	})

	it('handles invalid dates correctly', async () => {
		const input = wrapper.find('input')
		await input.setValue('31/02/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Format de date invalide (DD/MM/YYYY)')
	})

	it('formats input while typing', async () => {
		const input = wrapper.find('input')
		await input.setValue('01012025')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/01/2025')
	})

	it('validates modelValue with different dateFormatReturn format', async () => {
		const wrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '2025-1-1',
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-M-D',
				required: true,
			},
		})

		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toHaveLength(0)
		await wrapper.setProps({ modelValue: null })
		await wrapper.vm.$nextTick()
		const input = wrapper.find('input')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		expect(textField.props('errorMessages')).toContain('Format de date invalide (DD/MM/YYYY)')
	})

	it('formats date during input', async () => {
		const input = wrapper.find('input')
		await input.setValue('01012025')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/01/2025')
	})

	it('handles date deletion', async () => {
		// First set a valid date
		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()

		// Then delete it
		await input.setValue('')
		await input.trigger('input')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted?.[emitted.length - 1]).toEqual([null])
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('La date est requise.')
	})

	it('supports different date formats', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'YYYY-MM-DD',
				required: true,
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('2025-01-01')
		await input.trigger('input')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()

		const emitted = customWrapper.emitted('update:model-value')
		expect(emitted?.[emitted.length - 1]).toEqual(['2025-01-01'])
	})

	it('handles disabled state', async () => {
		await wrapper.setProps({ disabled: true })
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('disabled')).toBe(true)
	})

	it('handles readonly state', async () => {
		await wrapper.setProps({ readonly: true })
		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('readonly')).toBe(true)
	})

	it('emits focus and blur events', async () => {
		const input = wrapper.find('input')
		await input.trigger('focus')
		expect(wrapper.emitted('focus')).toBeTruthy()
		await input.trigger('blur')
		expect(wrapper.emitted('blur')).toBeTruthy()
	})

	it('handles custom date format return', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				required: true,
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()
		expect(customWrapper.emitted('update:model-value')?.[0]).toEqual(['2025-01-01'])
	})

	it('preserves cursor position during formatting', async () => {
		const input = wrapper.find('input')
		await input.setValue('01')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/__/____')

		// Simulate cursor position after "01"
		input.element.setSelectionRange(2, 2)
		await input.trigger('input')
		await wrapper.vm.$nextTick()

		// The cursor position should remain after "01"
		expect(input.element.selectionStart).toBe(2)
	})

	it('handles 2 digits year correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YY',
				dateFormatReturn: 'YYYY-MM-DD',
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('0')
		expect(input.element.value).toBe('0_/__/__')

		await input.setValue('01/02/99')
		expect(input.element.value).toBe('01/02/99')
		expect(customWrapper.emitted('update:model-value')?.at(-1)).toEqual(['1999-02-01'])
	})

	it('handles ISO-8601 date format correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'YYYY-MM-DD',
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('2025-')
		expect(input.element.value).toBe('2025-__-__')
		expect(customWrapper.emitted('update:model-value')).toBeFalsy()

		await input.setValue('2025-01-01')
		expect(input.element.value).toBe('2025-01-01')
		expect(customWrapper.emitted('update:model-value')?.at(-1)).toEqual(['2025-01-01'])
	})

	it('handles paste event with valid date', async () => {
		const input = wrapper.find('input')

		// Create a paste event with data
		const clipboardData = {
			getData: () => '01/01/2025',
		}

		await input.trigger('paste', {
			clipboardData,
		})
		await input.trigger('input')
		await wrapper.vm.$nextTick()

		expect(input.element.value).toBe('01/01/2025')
	})

	it('handles keydown events correctly', async () => {
		const input = wrapper.find('input')
		await input.trigger('keydown', {
			key: 'Tab',
		})
		// Check that the component doesn't prevent tab navigation
		expect(wrapper.emitted('update:model-value')).toBeFalsy()

		// Test behavior with Ctrl+V (paste)
		await input.trigger('keydown', {
			key: 'v',
			ctrlKey: true,
		})
		// Default behavior should be preserved
		expect(wrapper.emitted('update:model-value')).toBeFalsy()
	})

	it('validates on submit correctly', async () => {
		const input = wrapper.find('input')

		// Case 1: Empty field with required=true
		const emptyResult = await wrapper.vm.validateOnSubmit()
		expect(emptyResult).toBe(false)

		// Case 2: Valid date
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()

		const validResult = await wrapper.vm.validateOnSubmit()
		expect(validResult).toBe(true)
	})

	it('handles focus and blur methods correctly', async () => {
		// Create a mock for the input element
		const mockInput = { focus: vi.fn(), blur: vi.fn() }

		// Mock the component's querySelector method
		const mockQuerySelector = vi.fn().mockReturnValue(mockInput)

		// Replace the element reference and its querySelector method
		wrapper.vm.inputRef = {
			$el: {
				querySelector: mockQuerySelector,
			},
		}

		// Call the exposed methods
		wrapper.vm.focus()
		wrapper.vm.blur()

		// Check that querySelector was called with the right selector
		expect(mockQuerySelector).toHaveBeenCalledWith('input:not([type="hidden"])')

		// Check that the methods were called
		expect(mockInput.focus).toHaveBeenCalled()
		expect(mockInput.blur).toHaveBeenCalled()
	})

	it('initializes with model value correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: '01/01/2025',
				format: 'DD/MM/YYYY',
			},
		})

		await customWrapper.vm.$nextTick()
		const input = customWrapper.find('input')
		expect(input.element.value).toBe('01/01/2025')
	})

	it('handles different date separators correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD.MM.YYYY',
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('01.01.2025')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()

		expect(customWrapper.emitted('update:model-value')?.[0]).toEqual(['01.01.2025'])
	})

	it('handles partial date input correctly', async () => {
		const input = wrapper.find('input')

		// Enter only the day
		await input.setValue('01')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/__/____')

		// Add the month
		await input.setValue('01/02')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/02/____')

		// Complete the date
		await input.setValue('01/02/2025')
		await wrapper.vm.$nextTick()
		expect(input.element.value).toBe('01/02/2025')
	})

	it('handles success messages correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			props: {
				modelValue: '01/01/2024',
				customRules: [{
					type: 'custom',
					options: {
						validate: () => true,
						message: 'Date valide',
						fieldIdentifier: 'date',
						isSuccess: true,
					},
				}],
			},
			global: {
				plugins: [vuetify],
			},
		})

		// Force la validation
		const input = customWrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()
		await customWrapper.vm.$nextTick() // Double nextTick for reliability

		// Force manual validation
		await customWrapper.vm.validateOnSubmit()
		await customWrapper.vm.$nextTick()

		const textField = customWrapper.findComponent(SyTextField)
		const successMessages = textField.props('successMessages') || []

		// Flexible verification
		expect(successMessages.length).toBeGreaterThan(0)
		expect(successMessages[0]).toContain('valide')
	})

	it('handles multiple validation rules correctly', async () => {
		const customWrapper = mount(DateTextInput, {
			global: {
				plugins: [vuetify],
			},
			props: {
				modelValue: null,
				format: 'DD/MM/YYYY',
				required: true,
				customRules: [
					{
						type: 'custom',
						options: {
							validate: (value: string) => value.includes('2025'),
							message: 'La date doit être en 2025',
							fieldIdentifier: 'date',
						},
					},
					{
						type: 'custom',
						options: {
							validate: (value: string) => value.includes('01/'),
							message: 'Le mois doit être janvier',
							fieldIdentifier: 'date',
						},
					},
				],
			},
		})

		const input = customWrapper.find('input')
		await input.setValue('15/02/2025')
		await input.trigger('blur')
		await customWrapper.vm.$nextTick()

		const textField = customWrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Le mois doit être janvier')
	})
})
