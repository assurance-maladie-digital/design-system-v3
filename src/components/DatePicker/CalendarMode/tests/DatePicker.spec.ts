import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'

describe('CalendarMode.vue', () => {
	let wrapper

	beforeEach(() => {
		wrapper = mount(DatePicker, {
			props: {
				modelValue: '',
				required: true,
			},
		})
	})

	it('emits update:modelValue event on date selection', async () => {
		const wrapper = mount(DatePicker)
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	it('renders the component', () => {
		const wrapper = mount(DatePicker)
		expect(wrapper.exists()).toBe(true)
	})

	it('emits the correct formatted date on date selection', async () => {
		const input = wrapper.find('input')
		await input.setValue('01/01/2023')
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')[0]).toEqual(['01/01/2023'])
	})

	it('renders the date picker with proper structure', async () => {
		// Ouvrir le CalendarMode pour que les éléments soient dans le DOM
		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		// Simuler un clic pour s'assurer que le CalendarMode est complètement initialisé
		const input = wrapper.find('input')
		await input.trigger('click')
		await nextTick()
		// Attendre un peu pour que le DOM soit mis à jour
		await new Promise(resolve => setTimeout(resolve, 100))
		// Vérifier que le CalendarMode est visible
		const datePickerEl = document.querySelector('.v-date-picker')
		expect(datePickerEl).not.toBeNull()
		// Vérifier qu'il y a des boutons de navigation
		const navigationButtons = datePickerEl?.querySelectorAll('button') || []
		expect(navigationButtons.length).toBeGreaterThan(0)
	})

	it('handles invalid date input gracefully', async () => {
		const input = wrapper.find('input')
		await input.setValue('invalid date')
		expect(wrapper.vm.selectedDates).toBeNull()
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('removes the click event listener on unmount', async () => {
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

		// Monte le composant
		const wrapper = mount(DatePicker)

		// Démonte le composant
		wrapper.unmount()

		// Vérifie que removeEventListener a été appelé avec les bons arguments
		expect(removeEventListenerSpy).toHaveBeenCalledWith('click', wrapper.vm.handleClickOutside)

		// Nettoie le spy
		removeEventListenerSpy.mockRestore()
	})

	it('returns an array of all dates between two valid dates', () => {
		const datesArray = ['01/01/2023', '05/01/2023']
		const result = wrapper.vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBe(2)
		expect(result[0]).toBeInstanceOf(Date)
		expect(result[1]).toBeInstanceOf(Date)
		expect(result[0].toISOString().split('T')[0]).toBe('2023-01-01')
		expect(result[1].toISOString().split('T')[0]).toBe('2023-01-05')
	})

	it('handles invalid date inputs gracefully', () => {
		const datesArray = ['invalid date', '05/01/2023']
		const result = wrapper.vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(result).toEqual([])
	})

	it('handles a single date correctly', () => {
		const singleDate = '01/01/2023'
		const result = wrapper.vm.initializeSelectedDates(singleDate, 'DD/MM/YYYY')

		expect(result).toBeInstanceOf(Date)
		expect(result.toISOString().split('T')[0]).toBe('2023-01-01')
	})

	it('returns an empty array if start date is after end date', () => {
		const datesArray = ['05/01/2023', '01/01/2023']
		const result = wrapper.vm.initializeSelectedDates(datesArray, 'DD/MM/YYYY')

		expect(result).toEqual([])
	})

	it('returns true when there are no validation errors', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				required: true,
			},
		})

		wrapper.vm.selectedDates = [new Date('2023-01-01')]
		await nextTick()

		const result = wrapper.vm.validateOnSubmit()

		expect(result).toBe(true)
		expect(wrapper.vm.errorMessages).toEqual([])
	})

	it('returns false when there are validation errors', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				required: true,
			},
		})

		wrapper.vm.selectedDates = null
		await nextTick()

		const result = wrapper.vm.validateOnSubmit()

		expect(result).toBe(false)
		expect(wrapper.vm.errorMessages).toContain('La date est requise.')
	})

	it('parses a valid date string into a Date instance', () => {
		const modelValue = '15/01/2023'
		const result = wrapper.vm.initializeSelectedDates(modelValue, 'DD/MM/YYYY')

		expect(result).toBeInstanceOf(Date)
		expect(result.toISOString().split('T')[0]).toBe('2023-01-15')
	})

	it('returns null if modelValue is null or undefined', () => {
		const modelValue = null
		const result = wrapper.vm.initializeSelectedDates(modelValue, 'DD/MM/YYYY')

		expect(result).toBeNull()
	})

	it('handles an invalid date string gracefully', () => {
		const modelValue = 'invalid date'
		const result = wrapper.vm.initializeSelectedDates(modelValue, 'DD/MM/YYYY')

		expect(result).toBeNull()
	})

	it('sets selectedDates to null when input is empty', () => {
		wrapper.vm.updateSelectedDates('')

		expect(wrapper.vm.selectedDates).toBeNull()
	})

	it('parses a valid date string and updates selectedDates', () => {
		const validInput = '15/01/2023'
		wrapper.vm.updateSelectedDates(validInput)

		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)
		expect(wrapper.vm.selectedDates.toISOString().split('T')[0]).toBe('2023-01-15')
	})

	it('does not update selectedDates for invalid date string', () => {
		const invalidInput = 'invalid-date'
		wrapper.vm.updateSelectedDates(invalidInput)
		expect(wrapper.vm.selectedDates).toBeNull()
	})

	it('toggles date picker visibility correctly', async () => {
		const wrapper = mount(DatePicker)

		expect(wrapper.vm.isDatePickerVisible).toBe(false)

		wrapper.vm.openDatePicker()
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(true)

		wrapper.vm.isDatePickerVisible = false
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('validates required field correctly', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				required: true,
			},
		})

		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
		expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)
	})

	it('initializes selected dates correctly', async () => {
		const today = new Date()
		const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
		const wrapper = mount(DatePicker, {
			props: {
				modelValue: formattedDate,
				format: 'DD/MM/YYYY',
			},
		})

		await nextTick()
		expect(wrapper.vm.selectedDates).not.toBeNull()
	})

	it('supports date ranges when displayRange is true', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				displayRange: true,
			},
		})

		expect(wrapper.vm.selectedDates).toBeNull()
		const rangeInput = wrapper.find('input')
		expect(rangeInput.exists()).toBe(true)
	})

	it('properly displays error messages from validation', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				required: true,
			},
		})

		await wrapper.vm.validateOnSubmit()
		await nextTick()

		expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)
		const errorMessage = wrapper.find('.v-messages__message')
		expect(errorMessage.exists()).toBe(true)
		expect(errorMessage.text()).toContain('requise')
	})

	it('handles birth date mode properly', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				isBirthDate: true,
			},
		})

		expect(wrapper.props('isBirthDate')).toBe(true)

		wrapper.vm.openDatePicker()
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(true)
	}, 20000)

	it('takes into account disabled and readonly limitations', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				disabled: true,
			},
		})

		wrapper.vm.openDatePicker()
		await nextTick()

		expect(wrapper.vm.isDatePickerVisible).toBe(false)

		await wrapper.setProps({ disabled: false, readonly: true })
		wrapper.vm.openDatePicker()
		await nextTick()

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})
})
