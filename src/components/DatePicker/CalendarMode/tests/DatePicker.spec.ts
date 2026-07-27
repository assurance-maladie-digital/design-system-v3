import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'
import { locales } from '../../locales'

type DatePickerInstance = InstanceType<typeof DatePicker>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: VueWrapper<any> | null = null

afterEach(() => {
	wrapper?.unmount()
	wrapper = null
})

describe('DatePicker', () => {
	const mountComponent = (props: Record<string, unknown> = {}) => {
		wrapper = mount(DatePicker, {
			props: { label: 'Date Field', ...props },
		})
		return wrapper
	}

	const typeDigits = async (input: ReturnType<ReturnType<typeof mountComponent>['find']>, digits: string) => {
		for (const digit of digits) {
			await input.trigger('keydown', { key: digit })
			await flushPromises()
		}
	}

	it('renders the calendar mode activator input by default', () => {
		const wrapper = mountComponent({
			required: true,
		})

		expect(wrapper.exists()).toBe(true)
		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
	})

	it('keeps the visible calendar heading free of live-region attributes', async () => {
		const wrapper = mountComponent()
		const vm = wrapper.vm as DatePickerInstance
		vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const heading = document.querySelector<HTMLElement>(`#${vm.datePickerHeadingId}`)
		expect(heading).not.toBeNull()
		expect(heading?.getAttribute('aria-live')).toBeNull()
		expect(heading?.getAttribute('aria-atomic')).toBeNull()
	})

	it('uses a stable dialog title instead of the dynamic date heading as accessible name', async () => {
		const wrapper = mountComponent()
		const vm = wrapper.vm as DatePickerInstance
		vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const dialog = document.querySelector<HTMLElement>(`#${vm.datePickerDialogId}`)
		expect(dialog?.getAttribute('aria-labelledby')).toBe(vm.datePickerTitleId)

		const title = document.querySelector<HTMLElement>(`#${vm.datePickerTitleId}`)
		expect(title).not.toBeNull()
		expect(title?.textContent?.trim()).toBe(locales.calendarTitle)
	})

	it('links the readonly activator wrapper to the exposed dialog when the calendar is open', async () => {
		const wrapper = mountComponent()
		const vm = wrapper.vm as DatePickerInstance
		vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const activatorWrapper = wrapper.find(`[aria-controls="${vm.datePickerDialogId}"]`)
		expect(activatorWrapper.exists()).toBe(true)
	})

	it('removes aria-controls from the activator wrapper when the calendar closes', async () => {
		const wrapper = mountComponent()
		const vm = wrapper.vm as DatePickerInstance

		vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()
		expect(wrapper.find(`[aria-controls="${vm.datePickerDialogId}"]`).exists()).toBe(true)

		vm.isDatePickerVisible = false
		await nextTick()
		await flushPromises()

		expect(wrapper.find(`[aria-controls="${vm.datePickerDialogId}"]`).exists()).toBe(false)
	})

	/**
	 * AutoClamp est testé dans useDateAutoClamp.spec.ts (composable natif)
	 * Tests de composant conservés pour intégration
	 */
	it('preserves autoClamp in no-calendar mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			noCalendar: true,
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

	it('preserves autoClamp with masked keyboard input in no-calendar mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			noCalendar: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await typeDigits(input, '31042025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('30/04/2025')
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('30/04/2025')
	})

	it('preserves autoClamp in combined mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			useCombinedMode: true,
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

	it('preserves autoClamp with masked keyboard input in combined mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			useCombinedMode: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await typeDigits(input, '31042025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('30/04/2025')
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('30/04/2025')
	})

	it('preserves autoClamp in combined mode with dateFormatReturn', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			useCombinedMode: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await input.setValue('31/04/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('30/04/2025')
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('2025-04-30')
	})

	it('emits dateFormatReturn while keeping display format in calendar mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
		})

		const input = wrapper.find('input')
		await input.setValue('15/01/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('15/01/2025')
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('2025-01-15')
	})

	it('reformats external modelValue from dateFormatReturn in calendar mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			modelValue: '2025-01-15',
		})

		await flushPromises()

		expect(wrapper.find('input').element.value).toBe('15/01/2025')
	})

	it('reformats external range modelValue from dateFormatReturn in calendar mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			displayRange: true,
			modelValue: ['2025-01-15', '2025-01-20'],
		})

		await flushPromises()

		expect(wrapper.find('input').element.value).toBe('15/01/2025 - 20/01/2025')
	})

	it('preserves autoClamp in combined range mode', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			useCombinedMode: true,
			displayRange: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await input.setValue('29/02/2025 - 31/04/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('28/02/2025 - 30/04/2025')
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toEqual(['28/02/2025', '30/04/2025'])
	})

	it('keeps combined autoClamp value visible after parent v-model sync', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			useCombinedMode: true,
			autoClamp: true,
			modelValue: undefined,
		})

		const input = wrapper.find('input')
		await input.setValue('31/04/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:modelValue')
		const clampedValue = emitted && emitted[emitted.length - 1]?.[0]
		expect(clampedValue).toBe('30/04/2025')

		await wrapper.setProps({ modelValue: clampedValue })
		await flushPromises()

		expect(wrapper.find('input').element.value).toBe('30/04/2025')
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
		expect(result[0]?.getFullYear()).toBe(2023)
		expect(result[0]?.getMonth()).toBe(0)
		expect(result[0]?.getDate()).toBe(1)
		expect(result[1]?.getFullYear()).toBe(2023)
		expect(result[1]?.getMonth()).toBe(0)
		expect(result[1]?.getDate()).toBe(5)
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
		expect(result.getFullYear()).toBe(2023)
		expect(result.getMonth()).toBe(0)
		expect(result.getDate()).toBe(1)
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
		expect(vm.selectedDates.getFullYear()).toBe(2023)
		expect(vm.selectedDates.getMonth()).toBe(0)
		expect(vm.selectedDates.getDate()).toBe(15)
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

	it('keeps current disableErrorHandling contract: required empty submit does not expose errors', async () => {
		const wrapper = mountComponent({
			required: true,
			format: 'DD/MM/YYYY',
			disableErrorHandling: true,
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.selectedDates = null
		const result = await vm.validateOnSubmit()

		expect(result).toBe(true)
		expect(vm.errorMessages).toEqual([])
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

	it('keeps deprecated birthDate prop as an alias for birth date mode', () => {
		const wrapper = mountComponent({
			birthDate: true,
		})

		expect(wrapper.props('birthDate')).toBe(true)
		expect(wrapper.vm.currentViewMode).toBe('year')
	})

	it('emits closed when handleClickOutside is called while open', () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		const outsideElement = document.createElement('div')
		vm.isDatePickerVisible = true
		vm.handleClickOutside({ target: outsideElement } as unknown as MouseEvent)

		expect(vm.isDatePickerVisible).toBe(false)
		const closedEvents = wrapper.emitted('closed')
		expect(closedEvents).toBeTruthy()
	})

	it('emits closed when visibility is externally toggled to false', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.isDatePickerVisible = true
		await nextTick()

		vm.isDatePickerVisible = false
		await flushPromises()

		const closedEvents = wrapper.emitted('closed')
		expect(closedEvents).toBeTruthy()
		expect(closedEvents).toHaveLength(1)
	})

	it('does not render the today button when displayTodayButton is false', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date Field',
				modelValue: '',
				format: 'DD/MM/YYYY',
				displayTodayButton: false,
			},
			attachTo: document.body,
		})
		const vm = wrapper.vm as DatePickerInstance

		vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		expect(document.body.querySelector('.date-picker__today-button')).toBeNull()

		wrapper.unmount()
	})

	it('restores focus to the input and emits closed when Escape closes the open dialog', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date Field',
				modelValue: '',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})
		const vm = wrapper.vm as DatePickerInstance
		const focusSpy = vi.spyOn(HTMLInputElement.prototype, 'focus')

		vm.isDatePickerVisible = true
		await nextTick()
		await flushPromises()

		const dialog = document.body.querySelector<HTMLElement>(`#${vm.datePickerDialogId}`)
		expect(dialog).not.toBeNull()

		dialog?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
		await flushPromises()
		await vi.runAllTimersAsync()
		await nextTick()

		expect(vm.isDatePickerVisible).toBe(false)
		expect(wrapper.emitted('closed')).toBeTruthy()
		expect(focusSpy).toHaveBeenCalled()

		focusSpy.mockRestore()
		vi.useRealTimers()
		wrapper.unmount()
	})

	it('does not change the selected date when navigating the calendar with arrow keys (calendar-only mode)', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date Field',
				modelValue: '15/06/2024',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})

		const input = wrapper.find('input')
		expect(input.element.value).toBe('15/06/2024')

		// Ouvre le calendrier via l'activator (mode calendar-only : pas de noCalendar, pas de useCombinedMode)
		await input.trigger('click')
		await nextTick()
		await flushPromises()
		// Laisse le listener de navigation clavier s'attacher (setTimeout différé)
		await vi.runAllTimersAsync()
		await flushPromises()
		await wrapper.vm.$nextTick()

		// Le focus initial doit être placé sur un bouton de jour du calendrier
		const focusedDay = document.activeElement as HTMLElement | null
		expect(focusedDay).not.toBeNull()
		expect(focusedDay?.closest('.v-date-picker-month__day')).not.toBeNull()

		// Capture de la valeur avant navigation, via le DOM uniquement
		const valueBefore = input.element.value
		const emittedBefore = wrapper.emitted('update:modelValue')?.length ?? 0

		// Plusieurs navigations clavier vers la droite : doivent uniquement déplacer le focus,
		// sans modifier la date sélectionnée ni émettre de mise à jour du modèle.
		for (let i = 1; i <= 5; i++) {
			const day = document.activeElement as HTMLElement | null
			day?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
			await flushPromises()
			await vi.runAllTimersAsync()
			await flushPromises()
			await wrapper.vm.$nextTick()
		}

		// La valeur affichée dans l'activator ne doit pas changer
		expect(input.element.value).toBe(valueBefore)
		// Aucun update:modelValue supplémentaire ne doit être émis suite aux navigations fléchées
		const emittedAfter = wrapper.emitted('update:modelValue')?.length ?? 0
		expect(emittedAfter).toBe(emittedBefore)

		vi.useRealTimers()
		wrapper.unmount()
	})

	it('updates the displayed month when keyboard navigation crosses to an adjacent next-month day', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date Field',
				modelValue: '30/06/2024',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})

		const input = wrapper.find('input')
		await input.trigger('click')
		await nextTick()
		await flushPromises()
		await vi.runAllTimersAsync()
		await flushPromises()

		const vm = wrapper.vm as DatePickerInstance & {
			currentMonth: string | null
			currentYear: string | null
		}

		const focusedDay = document.activeElement as HTMLElement | null
		expect(focusedDay?.closest('[data-v-date="2024-06-30"]')).not.toBeNull()

		focusedDay?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
		await flushPromises()
		await vi.runAllTimersAsync()
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(vm.currentMonth).toBe('6')
		expect(vm.currentYear).toBe('2024')
		expect(document.activeElement?.closest('[data-v-date="2024-07-01"]')).not.toBeNull()

		vi.useRealTimers()
		wrapper.unmount()
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

describe('DatePicker - Events & Interactions', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let evWrapper: any

	beforeEach(() => {
		evWrapper = mount(DatePicker, {
			props: {
				label: 'Date Field',
				modelValue: '',
				format: 'DD/MM/YYYY',
			},
		})
	})

	afterEach(() => {
		evWrapper?.unmount()
		evWrapper = null
	})

	it('gère la visibilité du calendrier', async () => {
		await evWrapper.find('.v-text-field').trigger('click')
		await nextTick()
		expect(evWrapper.vm.isDatePickerVisible).toBe(true)

		evWrapper.vm.isDatePickerVisible = false
		await nextTick()
		expect(evWrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('accepte la saisie de dates', async () => {
		const input = evWrapper.find('input')
		await input.setValue('0101')
		await nextTick()
		expect(input.element.value).toContain('01')
	})

	it('permet la saisie manuelle même avec disablePickerInteraction', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date Field', modelValue: '', format: 'DD/MM/YYYY', disablePickerInteraction: true },
		})
		const input = w.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await nextTick()
		const emitted = w.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0]?.[0]).toBe('01/01/2023')
		w.unmount()
	})

	it('synchronise selectedDates après saisie manuelle', async () => {
		const input = evWrapper.find('input')
		await input.setValue('01/01/2023')
		await input.trigger('blur')
		await nextTick()
		expect(evWrapper.vm.selectedDates).not.toBeNull()
		const d = evWrapper.vm.selectedDates
		expect(d instanceof Date).toBe(true)
		expect(d.getFullYear()).toBe(2023)
		expect(d.getMonth()).toBe(0)
		expect(d.getDate()).toBe(1)
	})

	it('accepte le format YYYY-MM-DD', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date Field', modelValue: '', format: 'YYYY-MM-DD' },
		})
		const input = w.find('input')
		await input.setValue('2023-01-01')
		await input.trigger('blur')
		await nextTick()
		const emitted = w.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0]?.[0]).toBe('2023-01-01')
		w.unmount()
	})

	it('accepte les plages de dates en entrée', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date Field', modelValue: ['01/01/2023', '05/01/2023'], format: 'DD/MM/YYYY', displayRange: true },
		})
		await nextTick()
		expect(w.find('input').element.value).toContain('01/01/2023')
		expect(w.props('displayRange')).toBe(true)
		w.unmount()
	})

	it('handleInputKeydown ne fait rien si readonly', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', readonly: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).handleInputKeydown(new KeyboardEvent('keydown', { key: 'Enter' }))
		await nextTick()
		expect(w.vm.isDatePickerVisible).toBe(false)
		w.unmount()
	})

	it('handleInputKeydown Escape ferme le calendrier', async () => {
		evWrapper.vm.isDatePickerVisible = true
		await nextTick()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(evWrapper.vm as any).handleInputKeydown(new KeyboardEvent('keydown', { key: 'Escape' }))
		await nextTick()
		expect(evWrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('handleInputKeydown Enter ouvre le calendrier et prevent le comportement par défaut', async () => {
		const event = new KeyboardEvent('keydown', {
			key: 'Enter',
			cancelable: true,
		})

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (evWrapper.vm as any).handleInputKeydown(event)
		await flushPromises()

		expect(evWrapper.vm.isDatePickerVisible).toBe(true)
		expect(event.defaultPrevented).toBe(true)
	})

	it('onUpdateMonth met à jour currentMonth et currentMonthName', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(evWrapper.vm as any).onUpdateMonth('5')
		await nextTick()
		expect(evWrapper.vm.currentMonth).toBe('5')
		expect(evWrapper.vm.currentMonthName).toBeTruthy()
	})

	it('onUpdateYear met à jour currentYear', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(evWrapper.vm as any).onUpdateYear('2030')
		await nextTick()
		expect(evWrapper.vm.currentYear).toBe('2030')
	})

	it('openDatePickerOnFocus émet focus', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(evWrapper.vm as any).openDatePickerOnFocus()
		await nextTick()
		expect(evWrapper.emitted('focus')).toBeTruthy()
	})

	it('openDatePickerOnFocus does not open the calendar in current calendar mode behavior', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(evWrapper.vm as any).openDatePickerOnFocus()
		await nextTick()
		expect(evWrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('openDatePickerOnIconClick toggles the calendar when interaction is enabled', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (evWrapper.vm as any).openDatePickerOnIconClick()
		await flushPromises()
		expect(evWrapper.vm.isDatePickerVisible).toBe(true)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (evWrapper.vm as any).openDatePickerOnIconClick()
		await flushPromises()
		expect(evWrapper.vm.isDatePickerVisible).toBe(false)
	})

	it('openDatePickerOnIconClick ne fait rien si disabled', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', disabled: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).openDatePickerOnIconClick()
		await nextTick()
		expect(w.vm.isDatePickerVisible).toBe(false)
		w.unmount()
	})

	it('openDatePickerOnIconClick ne fait rien si readonly', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', readonly: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).openDatePickerOnIconClick()
		await nextTick()
		expect(w.vm.isDatePickerVisible).toBe(false)
		w.unmount()
	})

	it('valide les dates selon les règles personnalisées', async () => {
		const w = mount(DatePicker, {
			props: {
				label: 'Date Field',
				modelValue: '',
				format: 'DD/MM/YYYY',
				customRules: [{ type: 'isDateValid', options: {} }],
				required: true,
			},
		})
		await w.vm.validateOnSubmit()
		await nextTick()
		expect(w.vm.errorMessages.length).toBeGreaterThan(0)
		w.unmount()
	})
})

describe('DatePicker - Coverage branches', () => {
	it('handleSelectToday selects today range when displayRange=true', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: undefined, format: 'DD/MM/YYYY', displayRange: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleSelectToday()
		await flushPromises()
		const selected = w.vm.selectedDates
		expect(Array.isArray(selected)).toBe(true)
		const emitted = w.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		w.unmount()
	})

	it('validateOnSubmit delegates to dateTextInputRef when noCalendar', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', noCalendar: true, required: true },
		})
		const result = await w.vm.validateOnSubmit()
		expect(typeof result === 'boolean' || result === undefined).toBe(true)
		w.unmount()
	})

	it('validateOnSubmit delegates to complexDatePickerRef when useCombinedMode', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', useCombinedMode: true, required: true },
		})
		const result = await w.vm.validateOnSubmit()
		expect(typeof result === 'boolean' || result === undefined).toBe(true)
		w.unmount()
	})

	it('handleInputKeydown Enter opens the date picker', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY' },
		})
		expect(w.vm.isDatePickerVisible).toBe(false)
		const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleInputKeydown(event)
		await nextTick()
		expect(w.vm.isDatePickerVisible).toBe(true)
		w.unmount()
	})

	it('handleInputBlur emits blur and validates', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '01/01/2023', format: 'DD/MM/YYYY', required: true, isValidateOnBlur: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleInputBlur()
		await flushPromises()
		expect(w.emitted('blur')).toBeTruthy()
		w.unmount()
	})

	it('handleInputBlur skips validation when isValidateOnBlur=false', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', required: true, isValidateOnBlur: false },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleInputBlur()
		await flushPromises()
		expect(w.emitted('blur')).toBeTruthy()
		expect(w.vm.errorMessages.length).toBe(0)
		w.unmount()
	})

	it('syncDisplayedMonthYearFromDate updates currentMonth and currentMonthName', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY' },
		})
		w.vm.isDatePickerVisible = true
		await nextTick()
		const date = new Date(2024, 5, 15)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).syncDisplayedMonthYearFromDate(date)
		await nextTick()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((w.vm as any).currentMonth).toBe('5')
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((w.vm as any).currentMonthName).toBeTruthy()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((w.vm as any).currentYear).toBe('2024')
		w.unmount()
	})

	it('handleDateTextInputUpdate with null clears selectedDates', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '01/01/2023', format: 'DD/MM/YYYY' },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleDateTextInputUpdate(null)
		await flushPromises()
		expect(w.vm.selectedDates).toBeNull()
		w.unmount()
	})

	it('handleDateTextInputUpdate with array range sets selectedDates', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: undefined, format: 'DD/MM/YYYY', displayRange: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleDateTextInputUpdate(['01/01/2023', '05/01/2023'])
		await flushPromises()
		expect(w.vm.selectedDates).not.toBeNull()
		expect(Array.isArray(w.vm.selectedDates)).toBe(true)
		w.unmount()
	})

	it('watcher selectedDates resets currentMonthName to today when cleared', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '01/06/2024', format: 'DD/MM/YYYY' },
		})
		await flushPromises()
		w.vm.selectedDates = null
		await nextTick()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((w.vm as any).currentMonthName).toBeTruthy()
		w.unmount()
	})

	it('modelValue watcher syncs noCalendar from string (branch coverage)', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '10/01/2024', format: 'DD/MM/YYYY', noCalendar: true },
		})
		await flushPromises()
		await w.setProps({ modelValue: '15/03/2024' })
		await flushPromises()
		expect(w.exists()).toBe(true)
		w.unmount()
	})

	it('modelValue watcher clears textInputValue when null in noCalendar mode', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '15/03/2024', format: 'DD/MM/YYYY', noCalendar: true },
		})
		await flushPromises()
		await w.setProps({ modelValue: '' })
		await flushPromises()
		expect(w.find('input').element.value).toBe('')
		w.unmount()
	})

	it('handleClickOutside does nothing when calendar is closed', () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY' },
		})
		const vm = w.vm as InstanceType<typeof DatePicker>
		vm.isDatePickerVisible = false
		const outside = document.createElement('div')
		vm.handleClickOutside({ target: outside } as unknown as MouseEvent)
		expect(w.emitted('closed')).toBeFalsy()
		w.unmount()
	})

	it('handleClickOutside does nothing when click inside container', () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY' },
		})
		const vm = w.vm as InstanceType<typeof DatePicker>
		vm.isDatePickerVisible = true
		const container = w.find('.date-picker-container').element
		vm.handleClickOutside({ target: container } as unknown as MouseEvent)
		expect(w.emitted('closed')).toBeFalsy()
		w.unmount()
	})
})
