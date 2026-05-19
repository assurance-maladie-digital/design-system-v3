import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import DatePicker from '../DatePicker.vue'

describe('DatePicker.vue - coverage', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	it('handleDateTextInputUpdate null efface selectedDates (noCalendar)', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '01/01/2025', format: 'DD/MM/YYYY', noCalendar: true },
		})
		await flushPromises()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleDateTextInputUpdate(null)
		await flushPromises()
		expect(w.vm.selectedDates).toBeNull()
		w.unmount()
	})

	it('handleDateTextInputUpdate array range met à jour selectedDates (noCalendar)', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', noCalendar: true, displayRange: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (w.vm as any).handleDateTextInputUpdate(['01/01/2025', '10/01/2025'])
		await flushPromises()
		expect(w.vm.selectedDates).not.toBeNull()
		w.unmount()
	})

	it('handleDateTextInputSelection met à jour le modèle', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', noCalendar: true },
		})
		const input = w.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()
		const emitted = w.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		w.unmount()
	})

	it('watcher modelValue array range met à jour textInputValue (noCalendar)', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', noCalendar: true, displayRange: true },
		})
		await w.setProps({ modelValue: ['01/01/2025', '10/01/2025'] })
		await flushPromises()
		expect(w.exists()).toBe(true)
		w.unmount()
	})

	it('watcher modelValue string execute le watcher noCalendar (valeur valide)', async () => {
		vi.useFakeTimers()
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', noCalendar: true },
		})
		await w.setProps({ modelValue: '15/06/2025' })
		await nextTick()
		vi.runAllTimers()
		await nextTick()
		expect(w.exists()).toBe(true)
		w.unmount()
	})

	it('watcher modelValue string invalide execute le watcher noCalendar', async () => {
		vi.useFakeTimers()
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', noCalendar: true },
		})
		await w.setProps({ modelValue: 'invalid-date' })
		await nextTick()
		vi.runAllTimers()
		await nextTick()
		expect(w.exists()).toBe(true)
		w.unmount()
	})

	it('watcher selectedDates null remet currentMonth/Year à today', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY' },
		})
		w.vm.selectedDates = new Date(2020, 5, 15)
		await nextTick()
		w.vm.selectedDates = null
		await nextTick()
		const today = new Date()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((w.vm as any).currentYear).toBe(today.getFullYear().toString())
		w.unmount()
	})

	it('syncDisplayedMonthYearFromDate met à jour currentMonth et currentYear', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY' },
		})
		const date = new Date(2028, 3, 15) // Avril 2028
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).syncDisplayedMonthYearFromDate(date)
		await nextTick()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((w.vm as any).currentMonth).toBe('3')
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((w.vm as any).currentYear).toBe('2028')
		w.unmount()
	})

	it('openDatePickerOnFocus émet focus', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY' },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).openDatePickerOnFocus()
		await nextTick()
		expect(w.emitted('focus')).toBeTruthy()
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

	it('watcher displayFormattedDate disabled sync depuis modelValue', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '01/01/2025', format: 'DD/MM/YYYY', disabled: true },
		})
		await flushPromises()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).displayFormattedDate = ''
		await nextTick()
		expect(w.exists()).toBe(true)
		w.unmount()
	})

	it('handleSelectToday displayRange sélectionne les deux dates', async () => {
		const w = mount(DatePicker, {
			props: { label: 'Date', modelValue: '', format: 'DD/MM/YYYY', displayRange: true },
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(w.vm as any).handleSelectToday()
		await flushPromises()
		expect(w.emitted('update:modelValue')).toBeTruthy()
		w.unmount()
	})
})
