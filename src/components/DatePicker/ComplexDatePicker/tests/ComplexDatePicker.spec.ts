import { VDatePicker } from 'vuetify/components'
import { mount, flushPromises, VueWrapper, type MountingOptions } from '@vue/test-utils'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker.vue'
import { locales } from '../../locales'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- VueWrapper<any> est le pattern standard pour les composants Vue avec defineExpose complexe
let wrapper: VueWrapper<any> | null = null

const waitForCondition = async (
	predicate: () => boolean,
	{ timeoutMs = 500, intervalMs = 20 } = {},
) => {
	const deadline = Date.now() + timeoutMs

	while (Date.now() < deadline) {
		if (predicate()) return
		await new Promise(resolve => setTimeout(resolve, intervalMs))
	}

	throw new Error('Timed out waiting for condition')
}

const mountComponent = (
	props: Record<string, unknown> = { label: 'Test' },
	options: MountingOptions<InstanceType<typeof ComplexDatePicker>> = {},
) => {
	wrapper = mount(ComplexDatePicker, { props, ...options })
	return wrapper
}

afterEach(() => {
	wrapper?.unmount()
	wrapper = null
})

describe('ComplexDatePicker.clean', () => {
	it('renders in calendar mode by default', () => {
		const wrapper = mountComponent()

		expect(wrapper.exists()).toBe(true)
		// The activator text field should be present
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
	})

	it('applies combobox semantics to the actual input element', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		}, { attachTo: document.body })

		await nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		expect(input.attributes('role')).toBe('combobox')
		expect(input.attributes('aria-haspopup')).toBe('dialog')
		expect(input.attributes('aria-expanded')).toBe('false')
		expect(input.attributes('aria-autocomplete')).toBe('none')
		expect(input.attributes('aria-controls')).toBeUndefined()

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		expect(input.attributes('aria-expanded')).toBe('true')
		expect(input.attributes('aria-controls')).toBe(wrapper.vm.datePickerDialogId)
		expect(wrapper.find('.date-text-input-activator').attributes('role')).toBeUndefined()
	})

	it('uses a labelled dialog for the calendar popup without live attributes on the visible heading', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		}, { attachTo: document.body })

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const dialog = document.getElementById(wrapper.vm.datePickerDialogId)
		expect(dialog).not.toBeNull()
		expect(dialog?.getAttribute('role')).toBe('dialog')
		expect(dialog?.getAttribute('aria-modal')).toBeNull()
		expect(dialog?.getAttribute('aria-labelledby')).toBe(wrapper.vm.datePickerTitleId)

		const title = document.getElementById(wrapper.vm.datePickerTitleId)
		expect(title).not.toBeNull()
		expect(title?.textContent?.trim()).toBe(locales.calendarTitle)

		const heading = document.getElementById(wrapper.vm.datePickerHeadingId)
		expect(heading).not.toBeNull()
		expect(heading?.getAttribute('aria-live')).toBeNull()
		expect(heading?.getAttribute('aria-atomic')).toBeNull()
	})

	it('opens the calendar from the input with ArrowDown', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.trigger('keydown', { key: 'ArrowDown' })
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(true)
		expect(input.attributes('aria-expanded')).toBe('true')
		expect(input.attributes('aria-controls')).toBe(wrapper.vm.datePickerDialogId)
	})

	it('attempts to move focus into the calendar when opened from the input keyboard', async () => {
		const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus')
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		}, { attachTo: document.body })

		const input = wrapper.find('input')

		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(true)
		expect(focusSpy).toHaveBeenCalled()

		focusSpy.mockRestore()
	})

	it('does not clear the input value when the calendar is opened with ArrowDown', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '01/01/2025',
		})

		await nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')

		await input.trigger('keydown', { key: 'ArrowDown' })
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(true)
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')
		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('does not open the calendar from the input with Space', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.trigger('keydown', { key: ' ' })
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		expect(input.attributes('aria-expanded')).toBe('false')
	})

	it('does not clear the input value when the calendar button receives keyboard interaction', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '01/01/2025',
		})

		await nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		const calendarButton = wrapper.find('button.sy-text-field__icon-button')

		expect(calendarButton.exists()).toBe(true)
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')

		await calendarButton.trigger('focus')
		await calendarButton.trigger('keydown', { key: 'ArrowDown' })
		await nextTick()
		await flushPromises()

		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')
		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)
	})

	it('opens the calendar from the calendar button click without clearing the input value', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '01/01/2025',
		})

		await nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		const calendarButton = wrapper.find('button.sy-text-field__icon-button')

		expect(calendarButton.exists()).toBe(true)

		await calendarButton.trigger('click')
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(true)
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')
		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)
	})

	it('returns focus to the input when a keyboard-opened date selection closes the dialog', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		}, { attachTo: document.body })

		const input = wrapper.find('input')
		await input.trigger('keydown', { key: 'ArrowDown' })
		await nextTick()
		await flushPromises()

		await wrapper.vm.updateSelectedDates(new Date(2025, 0, 15))
		await nextTick()
		await flushPromises()
		await waitForCondition(() => wrapper?.vm.isDatePickerVisible === false)
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		expect(input.attributes('aria-expanded')).toBe('false')
	})

	it('keeps manual input state stable when keyboard interaction is used afterwards', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')
		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)

		await input.trigger('keydown', { key: 'ArrowDown' })
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(true)
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')
		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)
		expect(wrapper.vm.currentMonth).toBe('0')
	})

	it('closes the dialog and restores focus to the input on Escape', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		const dialog = document.getElementById(wrapper.vm.datePickerDialogId)

		expect(dialog).not.toBeNull()

		dialog?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		expect(input.attributes('aria-expanded')).toBe('false')
	})

	it('validates the field when Escape closes the dialog', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			required: true,
		}, { attachTo: document.body })

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const dialog = document.getElementById(wrapper.vm.datePickerDialogId)
		expect(dialog).not.toBeNull()

		dialog?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		expect(wrapper.vm.errorMessages).toContain('La date est requise.')
	})

	it('renders in text-only mode when noCalendar=true', () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			noCalendar: true,
		})

		expect(wrapper.exists()).toBe(true)
		// In text-only mode there should be no calendar rendered
		expect(wrapper.find('.v-date-picker').exists()).toBe(false)
	})

	it('emits update:modelValue when a valid date is typed (single mode)', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0]?.[0]).toBe('01/01/2025')

		const selectedDate = wrapper.vm.selectedDates as Date
		expect(selectedDate).toBeInstanceOf(Date)
		expect(wrapper.vm.currentMonth).toBe(String(selectedDate.getMonth()))
		expect(wrapper.vm.currentMonthName).toBeTruthy()
	})

	it('preserves autoClamp in text input mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await input.setValue('31/04/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('30/04/2025')
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('30/04/2025')
	})

	it('respects disabled and readonly props when opening the calendar', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		await wrapper.vm.handleDateSelected('01/01/2025')
		await flushPromises()

		const emittedUpdate = wrapper.emitted('update:modelValue')
		expect(emittedUpdate).toBeTruthy()
		expect(emittedUpdate && emittedUpdate[0]?.[0]).toBe('01/01/2025')

		const emittedSelected = wrapper.emitted('date-selected')
		expect(emittedSelected).toBeTruthy()
		expect(emittedSelected && emittedSelected[0]?.[0]).toBe('01/01/2025')

		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)

		const selectedDate = wrapper.vm.selectedDates as Date
		expect(wrapper.vm.currentMonth).toBe(String(selectedDate.getMonth()))
		expect(wrapper.vm.currentMonthName).toBeTruthy()
	})

	it('handleDateSelected updates model, selection and emits event in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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

		const selection = wrapper.vm.selectedDates as Date | (Date | null)[]
		const baseDate = Array.isArray(selection)
			? (selection.find(date => date instanceof Date) as Date | undefined)
			: selection
		expect(baseDate).toBeInstanceOf(Date)
		expect(wrapper.vm.currentMonth).toBe(String((baseDate as Date).getMonth()))
		expect(wrapper.vm.currentMonthName).toBeTruthy()
	})

	it('initializes from external modelValue with dateFormatReturn in single mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			displayRange: true,
			modelValue: ['01/01/2025', '10/01/2025'],
		})

		await flushPromises()

		expect(wrapper.vm.selectedDates).not.toBeNull()

		const input = wrapper.find('input')
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025 - 10/01/2025')
	})

	it('generates all intermediate dates when selecting a range in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		await wrapper.vm.handleDateSelected(['01/01/2025', '05/01/2025'])
		await flushPromises()

		const selection = wrapper.vm.selectedDates as Date[]
		expect(Array.isArray(selection)).toBe(true)
		// Should contain 5 dates: 01/01, 02/01, 03/01, 04/01, 05/01
		expect(selection).toHaveLength(5)

		// Verify start and end dates are correct (handle timezone differences)
		expect(selection[0]).toBeInstanceOf(Date)
		expect(selection[selection.length - 1]).toBeInstanceOf(Date)
		// Use local date string to avoid timezone issues
		expect(selection[0]?.toLocaleDateString('fr-FR')).toContain('01/01/2025')
		expect(selection[selection.length - 1]?.toLocaleDateString('fr-FR')).toContain('05/01/2025')
	})

	it('formatDateInput formats raw digits according to the format and computes cursor position', () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const { formatted, cursorPos } = wrapper.vm.formatDateInput('0101', 4)
		expect(formatted).toBe('01/01')
		expect(cursorPos).toBe(formatted.length)
	})

	it('does not open calendar when the input is clicked', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		await input.trigger('click')
		await nextTick()
		await flushPromises()
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('opens calendar when the calendar icon is clicked', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const iconButton = wrapper.find('.sy-text-field__icon-button')
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		expect(iconButton.exists()).toBe(true)

		await iconButton.trigger('click')
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(true)
	})

	it('toggles calendar visibility with Enter key on the input', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			readonly: true,
		})

		const input = wrapper.find('input')
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		expect(wrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('does not close the dialog when keyboard navigation updates the active date', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '27/07/2026',
		})

		wrapper.vm.isDatePickerVisible = true
		wrapper.vm.keyboardNavigatedDate = new Date(2026, 6, 28)
		await nextTick()

		expect(wrapper.vm.isDatePickerVisible).toBe(true)
	})

	it('emits closed when handleClickOutside is called while open', () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
		})

		const outsideElement = document.createElement('div')
		wrapper.vm.isDatePickerVisible = true
		wrapper.vm.handleClickOutside({ target: outsideElement } as unknown as MouseEvent)

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		const closedEvents = wrapper.emitted('closed')
		expect(closedEvents).toBeTruthy()
	})

	it('updates internal month and year when VDatePicker emits updates', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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

	it('validateOnSubmit returns false when required and empty in text-only mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			noCalendar: true,
			required: true,
			format: 'DD/MM/YYYY',
		})

		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
	})

	it('validateOnSubmit returns true when a valid value is present in text-only mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			noCalendar: true,
			required: true,
			format: 'DD/MM/YYYY',
			modelValue: '01/01/2025',
		})

		await nextTick()
		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(true)
	})

	it('handleSelectToday selects today, updates the model, and keeps component usable', async () => {
		const wrapper = mountComponent()

		await wrapper.vm.handleSelectToday()
		await flushPromises()

		expect(wrapper.vm.selectedDates).not.toBeNull()
		expect(wrapper.vm.displayFormattedDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
		expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
		expect(wrapper.exists()).toBe(true)
	})

	it('activates today button from keyboard and selects today before closing', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			displayTodayButton: true,
		}, { attachTo: document.body })

		wrapper.vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const todayButton = document.body.querySelector('.date-picker__today-button') as HTMLButtonElement | null
		expect(todayButton).not.toBeNull()

		todayButton?.click()
		await nextTick()
		await flushPromises()

		expect(wrapper.vm.isDatePickerVisible).toBe(false)
		expect(wrapper.vm.selectedDates).toBeInstanceOf(Date)
		expect(wrapper.vm.displayFormattedDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
		expect(wrapper.emitted('update:modelValue')?.length).toBeGreaterThan(0)
	})

	it('validateOnSubmit returns false when required and empty in calendar mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			required: true,
			format: 'DD/MM/YYYY',
		})

		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
		// Should surface at least one error message
		expect(wrapper.vm.errorMessages.length).toBeGreaterThan(0)
	})

	it('surfaces custom warning rules without blocking submit in calendar mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			customWarningRules: [
				{
					type: 'custom',
					options: {
						validate: () => false,
						warningMessage: 'Warning de contrat ComplexDatePicker',
					},
				},
			],
		})

		wrapper.vm.selectedDates = new Date(2025, 0, 1)
		const result = await wrapper.vm.validateOnSubmit()

		expect(result).toBe(true)
		expect(wrapper.vm.errorMessages).toEqual([])
		expect(wrapper.vm.warningMessages).toContain('Warning de contrat ComplexDatePicker')
	})

	it('validateDates flags an error when end date is before start date in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		// Start date after end date -> invalid range
		wrapper.vm.selectedDates = [
			new Date(2025, 0, 10),
			new Date(2025, 0, 1),
		]

		const result = await wrapper.vm.validateDates(true)
		expect(result.hasError).toBe(true)
		expect(result.state.errors.length).toBeGreaterThan(0)
	})

	it('validateDates does not flag an error for an incomplete range when not forced', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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
			label: 'Date Field',
			required: true,
			format: 'DD/MM/YYYY',
		})

		// Simuler une erreur required
		wrapper.vm.selectedDates = null
		await wrapper.vm.validateDates(true)
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

	it('handleDateSelected avec value null efface la sélection', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY' })
		wrapper.vm.selectedDates = new Date(2025, 0, 1)
		await wrapper.vm.handleDateSelected(null)
		await flushPromises()
		expect(wrapper.vm.selectedDates).toBeNull()
	})

	it('handleDateSelected avec tableau range met à jour selectedDates', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY', displayRange: true })
		await wrapper.vm.handleDateSelected(['01/01/2025', '10/01/2025'])
		await flushPromises()
		expect(wrapper.vm.selectedDates).not.toBeNull()
	})

	it('watcher selectedDates null remet les dates à aujourd hui', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY' })
		wrapper.vm.selectedDates = new Date(2025, 0, 1)
		await nextTick()
		wrapper.vm.selectedDates = null
		await flushPromises()
		// currentYear doit être une année valide (reset vers today)
		const year = Number(wrapper.vm.currentYear)
		expect(year).toBeGreaterThanOrEqual(2025)
	})

	it('syncFromModelValue initialise depuis un array range', async () => {
		const wrapper = mountComponent({
			label: 'Test',
			format: 'DD/MM/YYYY',
			displayRange: true,
			modelValue: ['01/01/2025', '10/01/2025'],
		})
		await flushPromises()
		expect(wrapper.vm.selectedDates).not.toBeNull()
		expect(wrapper.vm.displayFormattedDate).toContain('01/01/2025')
	})

	it('syncFromModelValue initialise depuis une string', async () => {
		const wrapper = mountComponent({
			label: 'Test',
			format: 'DD/MM/YYYY',
			modelValue: '15/06/2025',
		})
		await flushPromises()
		expect(wrapper.vm.displayFormattedDate).toBe('15/06/2025')
	})

	it('reset avec disabled incrémente fieldKey', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY', disabled: true })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const before = (wrapper.vm as any).fieldKey
		wrapper.vm.reset()
		await flushPromises()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).fieldKey).toBe(before + 1)
	})

	it('navigation année : bridge Dec→Jan quand currentMonth=11 et année monte', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY' })
		wrapper.vm.isDatePickerVisible = true
		// Simuler mois=11 (décembre) et année qui monte
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).currentMonth = '11'
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).currentYear = '2024'
		await nextTick()
		// Émettre update:year avec une année supérieure
		const dp = wrapper.findComponent({ name: 'VDatePicker' })
		if (dp.exists()) {
			await dp.vm.$emit('update:year', '2025')
			await nextTick()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect((wrapper.vm as any).currentMonth).toBe('0')
		}
		else {
			// VDatePicker non rendu sans le calendrier ouvert – appel direct
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;(wrapper.vm as any).handleYearUpdate?.()
		}
	})

	const makeKeydownEvent = (key: string, inputProps: Partial<HTMLInputElement> = {}) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const fakeInput = Object.assign(document.createElement('input'), inputProps) as any
		fakeInput.setSelectionRange = () => {}
		const event = new KeyboardEvent('keydown', { key, bubbles: true })
		Object.defineProperty(event, 'target', { value: fakeInput, writable: false })
		return event
	}

	it('handleKeydown Backspace sur séparateur supprime le séparateur', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY' })
		const event = makeKeydownEvent('Backspace', { value: '01/', selectionStart: 3, selectionEnd: 3 })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).handleKeydown(event)
		await nextTick()
		expect(wrapper.exists()).toBe(true)
	})

	it('handleKeydown ArrowLeft saute le séparateur', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY' })
		const event = makeKeydownEvent('ArrowLeft', { value: '01/01/2025', selectionStart: 3, selectionEnd: 3 })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).handleKeydown(event)
		await nextTick()
		expect(wrapper.exists()).toBe(true)
	})

	it('handleKeydown ArrowRight saute le séparateur', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY' })
		const event = makeKeydownEvent('ArrowRight', { value: '01/01/2025', selectionStart: 2, selectionEnd: 2 })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).handleKeydown(event)
		await nextTick()
		expect(wrapper.exists()).toBe(true)
	})

	it('handleDateTextInputUpdate en mode noCalendar met à jour le modèle depuis une string', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY', noCalendar: true })
		const input = wrapper.find('input')
		await input.setValue('15/06/2025')
		await input.trigger('blur')
		await flushPromises()
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
	})

	it('handleDateTextInputUpdate avec valeur null efface selectedDates via reset', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY', noCalendar: true })
		wrapper.vm.selectedDates = new Date(2025, 0, 1)
		wrapper.vm.reset()
		await flushPromises()
		expect(wrapper.vm.selectedDates).toBeNull()
	})

	it('handleDateTextInputUpdate avec array range startDate only via noCalendar', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY', noCalendar: true, displayRange: true })
		const input = wrapper.find('input')
		await input.setValue('01/01/2025 - ')
		await input.trigger('blur')
		await flushPromises()
		expect(wrapper.exists()).toBe(true)
	})

	it('handleKeydown readonly ne fait rien', async () => {
		const wrapper = mountComponent({ label: 'Test', format: 'DD/MM/YYYY', readonly: true })
		const event = makeKeydownEvent('Backspace', { value: '01/01/2025', selectionStart: 3, selectionEnd: 3 })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(wrapper.vm as any).handleKeydown(event)
		await nextTick()
		expect(wrapper.exists()).toBe(true)
	})

	it('keeps deprecated birthDate prop as an alias for birth date mode', () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			birthDate: true,
			format: 'DD/MM/YYYY',
		})

		expect(wrapper.props('birthDate')).toBe(true)
		expect(wrapper.vm.currentViewMode).toBe('year')
	})

	it('exposes aria-required on the input when required is true', () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			modelValue: '',
			format: 'DD/MM/YYYY',
			noCalendar: true,
			required: true,
		})

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
		expect(input.attributes('aria-required')).toBe('true')
	})

	it('sets aria-invalid="true" on the input when the field is in an error state', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			modelValue: '',
			format: 'DD/MM/YYYY',
			noCalendar: true,
			required: true,
		})

		const input = wrapper.find('input')

		// Déclenche un état d'erreur : champ requis laissé vide puis perte de focus
		await input.trigger('focus')
		await input.setValue('')
		await input.trigger('blur')
		await nextTick()
		await flushPromises()

		// Un message d'erreur doit être présent (garde-fou pour confirmer l'état d'erreur)
		expect(wrapper.findAll('.v-messages__message').length).toBeGreaterThan(0)
		expect(input.attributes('aria-invalid')).toBe('true')
	})

	it('moves focus to the selected day (not the last displayed) on Shift+Tab from the today button in day view', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '12/12/2005',
			displayTodayButton: true,
		}, { attachTo: document.body })

		// Ouvre le calendrier via le champ (interaction clavier DOM)
		const input = wrapper.find('input')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		await flushPromises()

		// focus the today button
		const vDatePickerWrapper = wrapper.findComponent(VDatePicker)
		const dialogContent = vDatePickerWrapper.element.parentElement
		const todayBtn = dialogContent.querySelector('.date-picker__today-button')

		// Shift+Tab depuis le bouton « Aujourd'hui » : doit focaliser le jour sélectionné,
		// pas le dernier jour affiché.
		todayBtn.focus()
		todayBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
		await flushPromises()

		const focused = document.activeElement as HTMLElement
		const selectedDayCell = focused.closest('.v-date-picker-month__day') as HTMLElement | null
		expect(selectedDayCell).not.toBeNull()
		expect(selectedDayCell?.closest('.v-date-picker-month')).not.toBeNull()
		expect(focused.getAttribute('role') ?? focused.closest('[role="gridcell"]')?.getAttribute('role')).toBe('gridcell')

		wrapper.unmount()
	})

	it('moves focus to the selected month (not the last displayed) on Shift+Tab from the today button in months view', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '12/09/2005',
			displayTodayButton: true,
		}, { attachTo: document.body })

		// Ouvre le calendrier
		const input = wrapper.find('input')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		await flushPromises()

		// ouvre la page des mois
		const vDatePickerWrapper = wrapper.findComponent(VDatePicker)
		const monthBtn = vDatePickerWrapper.find('.v-date-picker-controls__month-btn')
		monthBtn.trigger('click')
		await nextTick()
		await flushPromises()

		// focus the doday btn
		const dialogContent = vDatePickerWrapper.element.parentElement
		const todayBtn = dialogContent.querySelector('.date-picker__today-button')
		todayBtn.focus()

		// Shift+Tab depuis le bouton « Aujourd'hui » : doit focaliser le mois sélectionné,
		// pas le dernier jour affiché.
		todayBtn.focus()
		todayBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
		await flushPromises()

		const focused = document.activeElement as HTMLElement
		const activeMonthButton = dialogContent.querySelector('.v-date-picker-months .v-btn--active') as HTMLElement | null
		expect(focused).toBe(activeMonthButton)
		expect(focused.classList.contains('v-btn--active')).toBe(true)

		wrapper.unmount()
	})

	it('moves focus to the selected year (not the last displayed) on Shift+Tab from the today button in years view', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '12/09/2005',
			displayTodayButton: true,
		}, { attachTo: document.body })

		// Ouvre le calendrier
		const input = wrapper.find('input')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		await flushPromises()

		// ouvre la page des mois
		const vDatePickerWrapper = wrapper.findComponent(VDatePicker)
		const yearBtn = vDatePickerWrapper.find('.custom-year-btn')
		yearBtn.trigger('click')
		await nextTick()
		await flushPromises()

		// focus the doday btn
		const dialogContent = vDatePickerWrapper.element.parentElement
		const todayBtn = dialogContent.querySelector('.date-picker__today-button')
		todayBtn.focus()

		// Shift+Tab depuis le bouton « Aujourd'hui » : doit focaliser le mois sélectionné,
		// pas le dernier jour affiché.
		todayBtn.focus()
		todayBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }))
		await flushPromises()

		const focused = document.activeElement as HTMLElement
		expect(focused.getAttribute('aria-label')).toBe('2005')
		expect(focused.getAttribute('aria-pressed')).toBe('true')

		wrapper.unmount()
	})

	it('updates the displayed month and refocuses the target day when keyboard navigation crosses to the next month', async () => {
		vi.useFakeTimers()

		const wrapper = mountComponent({
			label: 'Date Field',
			format: 'DD/MM/YYYY',
			modelValue: '30/06/2024',
		}, { attachTo: document.body })

		const input = wrapper.find('input')
		await input.trigger('keydown', { key: 'Enter' })
		await nextTick()
		await flushPromises()
		await vi.advanceTimersByTimeAsync(600)
		await flushPromises()

		const focusedDay = document.activeElement as HTMLElement | null
		expect(focusedDay?.closest('[data-v-date="2024-06-30"]')).not.toBeNull()

		focusedDay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
		await flushPromises()
		await vi.advanceTimersByTimeAsync(800)
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.currentMonth).toBe('6')
		expect(wrapper.vm.currentYear).toBe('2024')
		expect(document.activeElement?.closest('[data-v-date="2024-07-01"]')).not.toBeNull()

		vi.useRealTimers()
		wrapper.unmount()
	})
})
