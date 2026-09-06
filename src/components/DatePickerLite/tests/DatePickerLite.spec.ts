import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DatePickerLite } from '@/components/index'
import DatePickerLiteComponent from '../DatePickerLite.vue'
import { nextTick } from 'vue'

async function openMenu(wrapper: Awaited<ReturnType<typeof mount>>) {
	await nextTick()
	await nextTick()

	const toggleBtn = wrapper.find('.date-picker-lite-input__toggle-btn')
	await toggleBtn.trigger('click')
	await nextTick()
}

describe('DatePickerLite', () => {
	afterEach(() => {
		vi.useRealTimers()
		document.body.innerHTML = ''
	})

	it('should expose DatePickerLite as the canonical public export', () => {
		expect(DatePickerLite).toBeDefined()
		expect(DatePickerLite).toBe(DatePickerLiteComponent)
	})

	it('should render DatePickerLite', () => {
		const wrapper = mount(DatePickerLiteComponent, {
			props: {
				label: 'Début du projet',
				modelValue: new Date(2025, 10, 11),
			},
			attachTo: document.body,
		})

		expect(wrapper.find('.date-picker-lite').exists()).toBeTruthy()
		expect(wrapper.find('input').element.value).toBe('11/11/2025')
		expect(wrapper).toMatchSnapshot()
		wrapper.unmount()
	})

	it('should open the menu when clicking on the toggle button', async () => {
		vi.useFakeTimers()
		const wrapper = mount(DatePickerLiteComponent, {
			props: {
				label: 'Début du projet',
				modelValue: new Date(2026, 11, 12),
			},
			attachTo: document.body,
		})

		await openMenu(wrapper)

		const menu = document.body.querySelector('.date-picker-lite-menu') as HTMLElement
		expect(menu).toBeTruthy()
		expect(menu).toMatchSnapshot()

		wrapper.unmount()
	})

	describe('DatePickerLiteInput', () => {
		it('should emit update:modelValue with a Date when a valid date is typed', async () => {
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
				},
			})

			const input = wrapper.find('input')
			await input.setValue('01/03/2027')
			expect(wrapper.emitted('update:modelValue')).toEqual([[new Date(2027, 2, 1)]])

			wrapper.unmount()
		})

		it('should not emit update:modelValue when the typed date is impossible', async () => {
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
				},
			})

			const input = wrapper.find('input')
			await input.setValue('32/13/2026')
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()

			wrapper.unmount()
		})

		it('should emit update:modelValue with undefined when the input is cleared', async () => {
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2025, 10, 11),
				},
			})

			const input = wrapper.find('input')
			await input.setValue('')
			expect(wrapper.emitted('update:modelValue')).toEqual([[undefined]])

			wrapper.unmount()
		})

		it('shows the correct value in the input when modelValue prop changes', async () => {
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2025, 10, 11),
				},
			})

			expect(wrapper.find('input').element.value).toBe('11/11/2025')

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore - Vue Test Utils cannot infer props from complex intersection type
			await wrapper.setProps({ modelValue: new Date(2026, 11, 12) })
			expect(wrapper.find('input').element.value).toBe('12/12/2026')

			wrapper.unmount()
		})
	})

	describe('DatePickerLiteVisual', () => {
		it('should emit update:modelValue when a day is selected in the calendar', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 1),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const dayButton = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2026-09-04"]')
			await dayButton.trigger('click')
			vi.advanceTimersByTime(1000)
			await vi.runAllTimersAsync()
			await nextTick()

			expect(wrapper.emitted('update:modelValue')).toEqual([[new Date(2026, 8, 4)]])
			expect(wrapper.emitted('update:open')).toEqual([[true], [false]])
			expect(wrapper.find('input').element.value).toBe('04/09/2026')

			wrapper.unmount()
		})

		it('should update the header label only when modelValue changes', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const headerDate = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-header__date')
			expect(headerDate.text()).toBe(new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

			const monthPillButton = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-month-btn')
			await monthPillButton.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11')
			await monthButton.trigger('click')

			expect(headerDate.text()).toBe(new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

			await wrapper.setProps({ modelValue: new Date(2026, 10, 5) })

			expect(headerDate.text()).toBe(new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 10, 5)))

			wrapper.unmount()
		})

		it('should reset the visual calendar when the modelValue is cleared', async () => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date(2023, 5, 15))
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const monthButtonHeader = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-month-btn')
			await monthButtonHeader.trigger('click')
			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11')
			await monthButton.trigger('click')
			expect(wrapper.findComponent({ name: 'Calendar' }).find('tbody').attributes('data-month')).toBe('2026-11')

			await wrapper.setProps({ modelValue: undefined })
			await nextTick()

			expect(wrapper.findComponent({ name: 'Calendar' }).find('tbody').attributes('data-month')).toBe('2023-06')

			wrapper.unmount()
		})

		it('should mark the selected day in the calendar', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const selectedDay = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2026-09-04"]')
			expect(selectedDay.attributes('aria-selected')).toBe('true')
			expect(selectedDay.classes()).toContain('sy-calendar__day--selected')

			wrapper.unmount()
		})

		it('should switch to the months view when the header pill is clicked, then back to days when a month is selected', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)
			expect(wrapper.findComponent({ name: 'Calendar' }).isVisible()).toBeTruthy()

			const monthPillButton = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-month-btn')
			await monthPillButton.trigger('click')

			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-header__date').text()).toBe(new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11')
			await monthButton.trigger('click')

			expect(wrapper.findComponent({ name: 'Calendar' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent({ name: 'Calendar' }).find('tbody').attributes('data-month')).toBe('2026-11')
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()

			wrapper.unmount()
		})

		it('should switch to the years view from the months view, then back to months when a year is selected', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const yearPillButton = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn')
			await yearPillButton.trigger('click')

			expect(wrapper.findComponent({ name: 'YearSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-header__date').text()).toBe(new Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2030')
			await yearButton.trigger('click')

			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.emitted('update:modelValue')).toBeUndefined()

			wrapper.unmount()
		})

		it('should respect the initialView prop', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					initialView: 'months',
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()

			wrapper.unmount()
		})

		it('should emit today when the footer button is clicked', async () => {
			vi.useFakeTimers()
			vi.setSystemTime(new Date(2023, 2, 15))
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const todayButton = document.body.querySelector('.month-picker-footer__current-month-btn') as HTMLElement
			expect(todayButton.textContent).toContain('Aujourd’hui')
			todayButton.click()
			await nextTick()
			vi.advanceTimersByTime(1000)
			await vi.runAllTimersAsync()
			await nextTick()

			expect(wrapper.emitted('update:modelValue')).toEqual([[new Date(2023, 2, 15)]])
			expect(wrapper.emitted('update:open')).toEqual([[true], [false]])

			wrapper.unmount()
		})

		it('should not open the menu when disabled', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					disabled: true,
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			expect(document.body.querySelector('.date-picker-lite-menu')).toBeFalsy()

			wrapper.unmount()
		})

		it('should not emit update:modelValue when readonly', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 1),
					readonly: true,
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const dayButton = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2026-09-04"]')
			await dayButton.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeUndefined()

			wrapper.unmount()
		})
	})
})
