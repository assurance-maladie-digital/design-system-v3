import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker.vue'

describe('ComplexDatePicker.clean', () => {
	const mountComponent = (props: Record<string, unknown> = {}) => mount(ComplexDatePicker, {
		props,
	})

	it('renders in calendar mode by default', () => {
		const wrapper = mountComponent()

		expect(wrapper.exists()).toBe(true)
		// The activator text field should be present
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
	})

	it('renders in text-only mode when noCalendar=true', () => {
		const wrapper = mountComponent({
			noCalendar: true,
		})

		expect(wrapper.exists()).toBe(true)
		// In text-only mode there should be no calendar rendered
		expect(wrapper.find('.v-date-picker').exists()).toBe(false)
	})

	it('emits update:modelValue when a valid date is typed (single mode)', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0][0]).toBe('01/01/2025')
	})

	it('respects disabled and readonly props when opening the calendar', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			disabled: true,
		})

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		await wrapper.vm.openDatePicker()
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(false)

		await wrapper.setProps({ disabled: false, readonly: true })
		await wrapper.vm.openDatePicker()
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('handleDateSelected updates model, selection and emits event in single mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		await wrapper.vm.handleDateSelected('01/01/2025')
		await flushPromises()

		const emittedUpdate = wrapper.emitted('update:modelValue')
		expect(emittedUpdate).toBeTruthy()
		expect(emittedUpdate && emittedUpdate[0][0]).toBe('01/01/2025')

		const emittedSelected = wrapper.emitted('date-selected')
		expect(emittedSelected).toBeTruthy()
		expect(emittedSelected && emittedSelected[0][0]).toBe('01/01/2025')

		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)
	})

	it('handleDateSelected updates model, selection and emits event in range mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		await wrapper.vm.handleDateSelected(['01/01/2025', '10/01/2025'])
		await flushPromises()

		const emittedUpdate = wrapper.emitted('update:modelValue')
		expect(emittedUpdate).toBeTruthy()

		const emittedSelected = wrapper.emitted('date-selected')
		expect(emittedSelected).toBeTruthy()

		expect(wrapper.vm.selectedDates).not.toBeNull()
	})

	it('initializes from external modelValue with dateFormatReturn in single mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			modelValue: '2025-01-02',
		})

		await flushPromises()

		// displayFormattedDate et l'input utilisent le format d'affichage
		expect(wrapper.vm.displayFormattedDate).toBe('02/01/2025')
		const input = wrapper.find('input')
		expect((input.element as HTMLInputElement).value).toBe('02/01/2025')
	})

	it('initializes selection correctly from range modelValue in range mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
			modelValue: ['01/01/2025', '10/01/2025'],
		})

		await flushPromises()

		expect(wrapper.vm.selectedDates).not.toBeNull()

		const input = wrapper.find('input')
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025 - ')
	})

	it('formatDateInput formats raw digits according to the format and computes cursor position', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const { formatted, cursorPos } = wrapper.vm.formatDateInput('0101', 4)
		expect(formatted).toBe('01/01')
		expect(cursorPos).toBe(formatted.length)
	})

	it('opens calendar when textFieldActivator is true and input is clicked', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			textFieldActivator: true,
		})

		const input = wrapper.find('input')
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		await input.trigger('click')
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(true)
	})

	it('toggles calendar visibility with Enter key on the input', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(true)
	})

	it('does not open calendar with Enter key when readonly', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			readonly: true,
		})

		const input = wrapper.find('input')
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('emits closed when handleClickOutside is called while open', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const outsideElement = document.createElement('div')
		wrapper.vm.isDatePickerVisible = true
		wrapper.vm.handleClickOutside({ target: outsideElement } as unknown as MouseEvent)

		const closedEvents = wrapper.emitted('closed')
		expect(closedEvents).toBeTruthy()
	})

	it('updates internal month and year when VDatePicker emits updates', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		wrapper.vm.isDatePickerVisible = true
		await nextTick()

		const datePicker = wrapper.findComponent({ name: 'VDatePicker' })
		expect(datePicker.exists()).toBe(true)

		await datePicker.vm.$emit('update:month', '5')
		await datePicker.vm.$emit('update:year', '2030')

		expect(wrapper.vm.currentMonth).toBe('5')
		expect(wrapper.vm.currentMonthName).not.toBeNull()
		expect(wrapper.vm.currentYear).toBe('2030')
		expect(wrapper.vm.currentYearName).toBe('2030')
	})

	it('validateOnSubmit returns false when required and empty in text-only mode', () => {
		const wrapper = mountComponent({
			noCalendar: true,
			required: true,
			format: 'DD/MM/YYYY',
		})

		const result = wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
	})

	it('validateOnSubmit returns true when a valid value is present in text-only mode', async () => {
		const wrapper = mountComponent({
			noCalendar: true,
			required: true,
			format: 'DD/MM/YYYY',
			modelValue: '01/01/2025',
		})

		await nextTick()
		const result = wrapper.vm.validateOnSubmit()
		expect(result).toBe(true)
	})

	it('handleSelectToday selects today and keeps component usable', async () => {
		const wrapper = mountComponent()

		await wrapper.vm.handleSelectToday()
		await flushPromises()

		expect(wrapper.vm.selectedDates).not.toBeNull()
		expect(wrapper.exists()).toBe(true)
	})

	it('validateOnSubmit returns false when required and empty in calendar mode', () => {
		const wrapper = mountComponent({
			required: true,
			format: 'DD/MM/YYYY',
		})

		const result = wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
		// Should surface at least one error message
		expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)
	})

	it('validateDates flags an error when end date is before start date in range mode', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		// Start date after end date -> invalid range
		wrapper.vm.selectedDates = [
			new Date(2025, 0, 10),
			new Date(2025, 0, 1),
		]

		const result = wrapper.vm.validateDates(true)
		expect(result.hasError).toBe(true)
		expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)
	})

	it('validateDates does not flag an error for an incomplete range when not forced', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		// First boundary set, second still empty (user is still typing)
		wrapper.vm.selectedDates = [
			new Date(2025, 0, 1),
			null,
		]

		const result = wrapper.vm.validateDates()
		expect(result.hasError).toBe(false)
		expect(wrapper.vm.errorMessages.length).toBe(0)
	})

	it('reset clears selection, errors and closes the calendar', async () => {
		const wrapper = mountComponent({
			required: true,
			format: 'DD/MM/YYYY',
		})

		// Simuler une erreur required
		wrapper.vm.selectedDates = null
		wrapper.vm.validateDates(true)
		expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)

		// Ouvrir le calendrier puis réinitialiser
		await wrapper.vm.toggleDatePicker()
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(true)

		wrapper.vm.reset()
		await flushPromises()

		expect(wrapper.vm.selectedDates).toBeNull()
		expect(wrapper.vm.errorMessages.length).toBe(0)
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})
})
