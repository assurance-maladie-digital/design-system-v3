import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'

type DatePickerInstance = InstanceType<typeof DatePicker>

describe('DatePicker', () => {
	const mountComponent = (props: Record<string, unknown> = {}) => mount(DatePicker, {
		props,
	})

	it('renders the calendar mode activator input by default', () => {
		const wrapper = mountComponent({
			required: true,
		})

		expect(wrapper.exists()).toBe(true)
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
	})

	it('emits update:modelValue when a valid date is typed in single mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0][0]).toBe('01/01/2023')
	})

	it('handles invalid typed date input gracefully', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		const input = wrapper.find('input')
		await input.setValue('invalid date')
		await input.trigger('blur')
		await flushPromises()

		expect(vm.selectedDates).toBeNull()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('initializeSelectedDates returns an array of dates for a valid range', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		const datesArray = ['01/01/2023', '05/01/2023']
		const result = vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(Array.isArray(result)).toBe(true)
		if (!Array.isArray(result)) {
			throw new Error('Expected initializeSelectedDates to return an array of dates')
		}
		expect(result.length).toBe(2)
		expect(result[0]).toBeInstanceOf(Date)
		expect(result[1]).toBeInstanceOf(Date)
		expect(result[0].toISOString().split('T')[0]).toBe('2023-01-01')
		expect(result[1].toISOString().split('T')[0]).toBe('2023-01-05')
	})

	it('initializeSelectedDates returns an empty array for invalid range inputs', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		const datesArray = ['invalid date', '05/01/2023']
		const result = vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(result).toEqual([])
	})

	it('initializeSelectedDates handles a single valid date correctly', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		const singleDate = '01/01/2023'
		const result = vm.initializeSelectedDates(singleDate, 'DD/MM/YYYY')

		expect(result).toBeInstanceOf(Date)
		if (!(result instanceof Date)) {
			throw new Error('Expected initializeSelectedDates to return a Date for a single valid date')
		}
		expect(result.toISOString().split('T')[0]).toBe('2023-01-01')
	})

	it('initializeSelectedDates returns an empty array when start date is after end date', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		const datesArray = ['05/01/2023', '01/01/2023']
		const result = vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(result).toEqual([])
	})

	it('updateSelectedDates sets selectedDates to null when input is empty', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.updateSelectedDates('')
		expect(vm.selectedDates).toBeNull()
	})

	it('updateSelectedDates parses a valid date string and updates selectedDates', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.updateSelectedDates('15/01/2023')
		expect(vm.selectedDates).toBeInstanceOf(Date)
		if (!(vm.selectedDates instanceof Date)) {
			throw new Error('Expected selectedDates to be a Date after parsing a valid string')
		}
		expect(vm.selectedDates.toISOString().split('T')[0]).toBe('2023-01-15')
	})

	it('updateSelectedDates does not update selectedDates for an invalid date string', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.selectedDates = null
		vm.updateSelectedDates('invalid-date')

		expect(vm.selectedDates).toBeNull()
	})

	it('validateOnSubmit returns false and sets error messages when required and empty', async () => {
		const wrapper = mountComponent({
			required: true,
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.selectedDates = null
		const result = await vm.validateOnSubmit()

		expect(result).toBe(false)
		expect(vm.errorMessages.length).toBeGreaterThan(0)
	})

	it('validateOnSubmit returns true and clears error messages when required and a date is selected', async () => {
		const wrapper = mountComponent({
			required: true,
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.selectedDates = new Date('2023-01-01')
		const result = await vm.validateOnSubmit()

		expect(result).toBe(true)
		expect(vm.errorMessages).toEqual([])
	})

	it('does not produce validation errors when required and readonly with empty selection', async () => {
		const wrapper = mountComponent({
			required: true,
			format: 'DD/MM/YYYY',
			readonly: true,
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.selectedDates = null
		const result = await vm.validateOnSubmit()

		expect(result).toBe(true)
		expect(vm.errorMessages.length).toBe(0)
	})

	it('toggles date picker visibility with openDatePicker', async () => {
		const wrapper = mountComponent()
		const vm = wrapper.vm as DatePickerInstance

		expect(vm.isDatePickerVisible).toBe(false)

		vm.openDatePicker()
		await nextTick()
		expect(vm.isDatePickerVisible).toBe(true)

		vm.isDatePickerVisible = false
		await nextTick()
		expect(vm.isDatePickerVisible).toBe(false)
	})

	it('respects disabled and readonly props when opening the calendar', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			disabled: true,
		})
		const vm = wrapper.vm as DatePickerInstance

		expect(vm.isDatePickerVisible).toBe(false)
		vm.openDatePicker()
		await nextTick()
		expect(vm.isDatePickerVisible).toBe(false)

		await wrapper.setProps({ disabled: false, readonly: true })
		vm.openDatePicker()
		await nextTick()
		expect(vm.isDatePickerVisible).toBe(false)
	})

	it('initializes selected dates from a valid modelValue', async () => {
		const today = new Date()
		const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
		const wrapper = mountComponent({
			modelValue: formattedDate,
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		await nextTick()
		expect(vm.selectedDates).not.toBeNull()
	})

	it('supports date ranges when displayRange is true', () => {
		const wrapper = mountComponent({
			displayRange: true,
		})
		const vm = wrapper.vm as DatePickerInstance

		expect(vm.selectedDates).toBeNull()
		const rangeInput = wrapper.find('input')
		expect(rangeInput.exists()).toBe(true)
	})

	it('handles birth date mode properly', async () => {
		const wrapper = mountComponent({
			isBirthDate: true,
		})
		const vm = wrapper.vm as DatePickerInstance

		expect(wrapper.props('isBirthDate')).toBe(true)

		vm.openDatePicker()
		await nextTick()
		expect(vm.isDatePickerVisible).toBe(true)
	}, 20000)

	it('emits closed when handleClickOutside is called while open', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		const outsideElement = document.createElement('div')
		vm.isDatePickerVisible = true
		vm.handleClickOutside({ target: outsideElement } as unknown as MouseEvent)

		const closedEvents = wrapper.emitted('closed')
		expect(closedEvents).toBeTruthy()
	})

	it('handleSelectToday selects today and keeps the component usable', async () => {
		const wrapper = mountComponent()
		const vm = wrapper.vm as DatePickerInstance

		await vm.handleSelectToday()
		await flushPromises()

		expect(vm.selectedDates).not.toBeNull()
		expect(wrapper.exists()).toBe(true)
	})
})
