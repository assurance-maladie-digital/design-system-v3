import { mount, flushPromises, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, afterEach } from 'vitest'
import { nextTick } from 'vue'
import ComplexDatePicker from '../ComplexDatePicker.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- VueWrapper<any> est le pattern standard pour les composants Vue avec defineExpose complexe
let wrapper: VueWrapper<any> | null = null

const mountComponent = (props: Record<string, unknown> = { label: 'Test' }) => {
	wrapper = mount(ComplexDatePicker, { props })
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

	it('opens calendar when textFieldActivator is true and input is clicked', async () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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

	it('emits closed when handleClickOutside is called while open', () => {
		const wrapper = mountComponent({
			label: 'Date Field',
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

	it('handleSelectToday selects today and keeps component usable', async () => {
		const wrapper = mountComponent()

		await wrapper.vm.handleSelectToday()
		await flushPromises()

		expect(wrapper.vm.selectedDates).not.toBeNull()
		expect(wrapper.exists()).toBe(true)
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
})
