import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, computed } from 'vue'
import { DatePickerLite } from '@/components/index'
import { calendarLocalesKey } from '@/components/Common/Calendar/locales'
import DatePickerLiteComponent from '../DatePickerLite.vue'
import DatePickerLiteHeader from '../DatePickerLiteHeader.vue'

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

	it('should render month and year labels from the displayed calendar month in the header', () => {
		const wrapper = mount(DatePickerLiteHeader, {
			props: {
				modelValue: new Date(2026, 8, 4),
				displayedMonth: new Date(2026, 11, 4),
				view: 'days',
				minYear: 1900,
				maxYear: 2100,
			},
			global: {
				provide: {
					[calendarLocalesKey as symbol]: computed(() => ({
						monthSelectorLabel: 'Sélectionner un mois',
						yearSelectorLabel: 'Sélectionner une année',
						yearBtnLabelSelected: (value: string) => `Année ${value}`,
						yearBtnLabelUnselected: (value: string) => `Choisir ${value}`,
						monthBtnLabelSelected: (value: string) => `Mois ${value}`,
						monthBtnLabelUnselected: (value: string) => `Choisir ${value}`,
						previousMonthBtnLabel: 'Mois précédent',
						nextMonthBtnLabel: 'Mois suivant',
					})),
				},
			},
		})

		const monthLabel = new Intl.DateTimeFormat(navigator.language, { month: 'short' }).format(new Date(2000, 11))
		const shortMonthLabel = monthLabel.length >= 4 ? monthLabel.slice(0, 4) : monthLabel.padEnd(4, '.')
		const yearLabel = '2026'

		expect(wrapper.find('.visual-picker-month-btn').text()).toContain(shortMonthLabel)
		expect(wrapper.find('.visual-picker-year-btn').text()).toContain(yearLabel)
		wrapper.unmount()
	})

	it('should disable previous/next month navigation when the view is not the calendar days view', () => {
		const wrapper = mount(DatePickerLiteHeader, {
			props: {
				modelValue: new Date(2026, 8, 4),
				displayedMonth: new Date(2026, 11, 4),
				view: 'months',
				minYear: 1900,
				maxYear: 2100,
			},
			global: {
				provide: {
					[calendarLocalesKey as symbol]: computed(() => ({
						monthSelectorLabel: 'Sélectionner un mois',
						yearSelectorLabel: 'Sélectionner une année',
						yearBtnLabelSelected: (value: string) => `Année ${value}`,
						yearBtnLabelUnselected: (value: string) => `Choisir ${value}`,
						monthBtnLabelSelected: (value: string) => `Mois ${value}`,
						monthBtnLabelUnselected: (value: string) => `Choisir ${value}`,
						previousMonthBtnLabel: 'Mois précédent',
						nextMonthBtnLabel: 'Mois suivant',
					})),
				},
			},
		})

		expect(wrapper.find('.date-picker-lite-header__nav--prev').attributes('disabled')).toBeDefined()
		expect(wrapper.find('.date-picker-lite-header__nav--next').attributes('disabled')).toBeDefined()
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

	describe('validation', () => {
		it('show the error message when the typed date is incomplete', async () => {
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
							message: 'Invalid date format. Use DD/MM/YYYY.',
						},
					}],
				},
			})

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.setValue('25/12/20')
			await input.trigger('blur')

			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
			expect(wrapper.find('.v-field--error').exists()).toBe(true)
			expect(wrapper.find('.v-input__details').text()).toBe('Invalid date format. Use DD/MM/YYYY.')

			wrapper.unmount()
		})

		it('should not show an error message when the typed date is valid', async () => {
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
							message: 'Invalid date format. Use DD/MM/YYYY.',
						},
					}],
				},
			})

			const input = wrapper.find('input')
			await input.setValue('25/12/2026')
			await input.trigger('blur')
			await input.trigger('focus')

			expect(wrapper.find('.v-field--error').exists()).toBe(false)
			expect(wrapper.find('.v-input__details').text()).toBe('Format JJ/MM/AAAA')

			wrapper.unmount()
		})

		it('shows the required error and clears it when a date is selected via the visual picker', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					required: true,
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.trigger('focus')
			await input.trigger('blur')
			await nextTick()

			expect(wrapper.find('.v-field--error').exists()).toBe(true)
			expect(wrapper.find('.v-input__details').text()).toContain('Le champ Début du projet est requis.')

			await openMenu(wrapper)
			const dayButton = wrapper.findComponent({ name: 'Calendar' }).find('[data-date="2026-09-04"]')
			await dayButton.trigger('click')
			vi.advanceTimersByTime(1000)
			await vi.runAllTimersAsync()
			await nextTick()

			expect(wrapper.find('.v-field--error').exists()).toBe(false)
			expect(wrapper.find('input').element.value).toBe('04/09/2026')

			wrapper.unmount()
		})
	})

	describe('DatePickerLiteVisual', () => {
		it('should render a dedicated month navigation header in the date picker', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)
			const menuEl = document.body.querySelector('.date-picker-lite-menu') as HTMLElement
			expect(menuEl.querySelector('.date-picker-lite-header__nav--prev')).toBeTruthy()
			expect(menuEl.querySelector('.date-picker-lite-header__nav--next')).toBeTruthy()
			expect(menuEl.querySelector('.date-picker-lite-header__label')?.textContent).toContain(new Intl.DateTimeFormat(navigator.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

			await (menuEl.querySelector('.date-picker-lite-header__nav--next') as HTMLElement).click()
			expect(wrapper.findComponent({ name: 'Calendar' }).find('tbody').attributes('data-month')).toBe('2026-10')

			wrapper.unmount()
		})

		it('should toggle the month and year views open and closed', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const monthToggle = document.body.querySelector('.visual-picker-month-btn') as HTMLElement
			const yearToggle = document.body.querySelector('.visual-picker-year-btn') as HTMLElement

			await monthToggle.click()
			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()

			await monthToggle.click()
			expect(wrapper.findComponent({ name: 'Calendar' }).isVisible()).toBeTruthy()

			await yearToggle.click()
			expect(wrapper.findComponent({ name: 'YearSelector' }).isVisible()).toBeTruthy()

			await yearToggle.click()
			expect(wrapper.findComponent({ name: 'Calendar' }).isVisible()).toBeTruthy()

			wrapper.unmount()
		})

		it('should loop focus within the popup when tabbing', async () => {
			vi.useFakeTimers()
			const wrapper = mount(DatePickerLiteComponent, {
				props: {
					label: 'Début du projet',
					modelValue: new Date(2026, 8, 4),
				},
				attachTo: document.body,
			})

			await openMenu(wrapper)

			const menuEl = document.body.querySelector('.date-picker-lite-menu') as HTMLElement
			const focusables = Array.from(
				menuEl.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]'),
			).filter((el) => {
				return !el.hasAttribute('disabled')
					&& el.getAttribute('aria-hidden') !== 'true'
					&& el.tabIndex !== -1
			})

			expect(focusables.length).toBeGreaterThan(1)

			const firstFocusable = focusables[0]
			const lastFocusable = focusables[focusables.length - 1]

			lastFocusable.focus()
			menuEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
			expect(document.activeElement).toBe(firstFocusable)

			firstFocusable.focus()
			menuEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }))
			expect(document.activeElement).toBe(lastFocusable)

			wrapper.unmount()
		})

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

			const headerDate = wrapper.findComponent(DatePickerLiteHeader).find('.visual-picker-header__date')
			expect(headerDate.text()).toBe(new Intl.DateTimeFormat(navigator.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

			const monthPillButton = wrapper.findComponent(DatePickerLiteHeader).find('.visual-picker-month-btn')
			await monthPillButton.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11')
			await monthButton.trigger('click')

			expect(headerDate.text()).toBe(new Intl.DateTimeFormat(navigator.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

			await wrapper.setProps({ modelValue: new Date(2026, 10, 5) })

			expect(headerDate.text()).toBe(new Intl.DateTimeFormat(navigator.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 10, 5)))

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

			const monthButtonHeader = wrapper.findComponent(DatePickerLiteHeader).find('.visual-picker-month-btn')
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

			const monthPillButton = wrapper.findComponent(DatePickerLiteHeader).find('.visual-picker-month-btn')
			await monthPillButton.trigger('click')

			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent(DatePickerLiteHeader).find('.visual-picker-header__date').text()).toBe(new Intl.DateTimeFormat(navigator.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

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

			const yearPillButton = wrapper.findComponent(DatePickerLiteHeader).find('.visual-picker-year-btn')
			await yearPillButton.trigger('click')

			expect(wrapper.findComponent({ name: 'YearSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent(DatePickerLiteHeader).find('.visual-picker-header__date').text()).toBe(new Intl.DateTimeFormat(navigator.language, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(2026, 8, 4)))

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
