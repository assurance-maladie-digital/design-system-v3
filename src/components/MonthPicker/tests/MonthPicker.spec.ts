import { mount } from '@vue/test-utils'
import { describe, afterEach, expect, it, vi } from 'vitest'
import MonthPicker from '../MonthPicker.vue'
import { nextTick } from 'vue'

describe('mounthpicker', () => {
	it('should render mounthpicker', () => {
		const wrapper = mount(MonthPicker, {
			props: {
				label: 'Début du projet',
				modelValue: '11/2025',
			},
			attachTo: document.body,
		})

		expect(wrapper.find('.month-picker').exists()).toBeTruthy()
		expect(wrapper).toMatchSnapshot()
		wrapper.unmount()
	})

	it('should open the menu when clicking on the input', async () => {
		vi.useFakeTimers()
		const wrapper = mount(MonthPicker, {
			props: {
				label: 'Début du projet',
				modelValue: '12/2026',
			},
			attachTo: document.body,
		})

		// Wait for the VMenu to resolve the differents ref used to find the activator element
		await nextTick()
		await nextTick()

		const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
		await toggleBtn.trigger('click')

		const monthPickerVisualWrapper = document.body.querySelector('.month-picker-menu') as HTMLElement
		expect(monthPickerVisualWrapper).toBeTruthy()
		expect(monthPickerVisualWrapper).toMatchSnapshot()

		wrapper.unmount()
	})

	describe('MonthPickerInput', () => {
		it('should emit update:modelValue when the input value changes', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
				},
			})

			const input = wrapper.find('input')
			await input.setValue('01/2027')
			expect(wrapper.emitted('update:modelValue')).toEqual([['01/2027']])

			wrapper.unmount()
		})

		it('should emit multiple update:modelValue when the input value changes multiple times', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
				},
			})
			const input = wrapper.find('input')

			await input.setValue('01/2027')
			await input.setValue('02/2027')
			await input.setValue('03/2030')

			expect(wrapper.emitted('update:modelValue')).toEqual([['01/2027'], ['02/2027'], ['03/2030']])

			wrapper.unmount()
		})

		it('shows the correct value in the input when modelValue prop changes', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
			})

			expect(wrapper.find('input').element.value).toBe('11/2025')

			await wrapper.setProps({ modelValue: '12/2026' })
			expect(wrapper.find('input').element.value).toBe('12/2026')

			wrapper.unmount()
		})
	})

	describe('MonthPickerVisual', () => {
		it('should emit update:modelValue when a month is selected and a year is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2024')
			await yearButton.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toEqual([['01/2024']]) // The month part of the value should be '01'

			wrapper.unmount()
		})

		it('do not emit update:modelValue when only a month is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeFalsy() // The value should not be emitted when only a month is selected

			wrapper.unmount()
		})

		it('do not emit update:modelValue when only a month is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeFalsy() // The value should not be emitted when only a month is selected

			wrapper.unmount()
		})

		it('do not emit update:modelValue when only a year is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const switchViewBtn = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn')
			await switchViewBtn.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2024')
			await yearButton.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeFalsy() // The value should not be emitted when only a year is selected

			wrapper.unmount()
		})

		it('shows the year picker after the month is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			expect(wrapper.findComponent({ name: 'MonthSelector' }).exists()).toBeFalsy()
			expect(wrapper.findComponent({ name: 'YearSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent({ name: 'YearSelector' })).toMatchSnapshot()

			wrapper.unmount()
		})

		it('shows the month picker after the year is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			// Switch to year selector
			const switchViewBtn = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn')
			await switchViewBtn.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2024')
			await yearButton.trigger('click')

			expect(wrapper.findComponent({ name: 'YearSelector' }).exists()).toBeFalsy()
			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent({ name: 'MonthSelector' })).toMatchSnapshot()

			wrapper.unmount()
		})

		it ('should close the menu after selecting a year and then a month', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			// Switch to year selector
			const switchViewBtn = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn')
			await switchViewBtn.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2024')
			await yearButton.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			const monthPickerVisualWrapper = wrapper.findComponent({ name: 'MonthPickerVisual' }).find('.month-picker-menu')
			expect(monthPickerVisualWrapper.exists()).toBeFalsy()

			expect(wrapper.emitted('update:modelValue')).toEqual([['01/2024']]) // The value should be '01/2024' after selecting January and 2024
			expect(wrapper.emitted('update:open')).toEqual([[true], [false]]) // The menu should be closed after selecting a month and a year

			wrapper.unmount()
		})

		it('show the selected month in the visual month picker', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11') // November button
			expect(monthButton.classes()).toContain('month-selector__month--active')

			wrapper.unmount()
		})

		it('show the correct year in the visual year picker', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2025')
			expect(yearButton.classes()).toContain('year-selector__year--active')

			wrapper.unmount()
		})

		describe('keyboard navigation', () => {
			it('should navigate through months using arrow keys', async () => {
				const wrapper = mount(MonthPicker, {
					props: {
						label: 'Début du projet',
						modelValue: '11/2025',
					},
					attachTo: document.body,
				})

				// Wait for the VMenu to resolve the differents ref used to find the activator element
				await nextTick()
				await nextTick()

				const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
				await toggleBtn.trigger('click')

				const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11')
				expect(monthButton.attributes('tabindex')).toBe('0')

				await monthButton.trigger('keydown', { key: 'ArrowLeft' })
				expect(wrapper.findComponent({ name: 'MonthSelector' }).find('.month-10').attributes('tabindex')).toBe('0')

				await monthButton.trigger('keydown', { key: 'ArrowRight' })
				expect(wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11').attributes('tabindex')).toBe('0')

				await monthButton.trigger('keydown', { key: 'ArrowUp' })
				expect(wrapper.findComponent({ name: 'MonthSelector' }).find('.month-9').attributes('tabindex')).toBe('0')

				await monthButton.trigger('keydown', { key: 'ArrowDown' })
				expect(wrapper.findComponent({ name: 'MonthSelector' }).find('.month-11').attributes('tabindex')).toBe('0')

				wrapper.unmount()
			})

			it('should navigate through years using arrow keys', async () => {
				const wrapper = mount(MonthPicker, {
					props: {
						label: 'Début du projet',
						modelValue: '11/2025',
					},
					attachTo: document.body,
				})

				// Wait for the VMenu to resolve the differents ref used to find the activator element
				await nextTick()
				await nextTick()

				const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
				await toggleBtn.trigger('click')

				const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
				await monthButton.trigger('click')

				const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2025')
				expect(yearButton.attributes('tabindex')).toBe('0')

				await yearButton.trigger('keydown', { key: 'ArrowUp' })
				expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2022').attributes('tabindex')).toBe('0')

				await yearButton.trigger('keydown', { key: 'ArrowDown' })
				expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2025').attributes('tabindex')).toBe('0')

				await yearButton.trigger('keydown', { key: 'ArrowLeft' })
				expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2024').attributes('tabindex')).toBe('0')

				await yearButton.trigger('keydown', { key: 'ArrowRight' })
				expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2025').attributes('tabindex')).toBe('0')

				wrapper.unmount()
			})
		})

		it ('show the years in the correct order according to the yearsOrder prop', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
					yearsOrder: 'desc',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			const yearButtons = wrapper.findComponent({ name: 'YearSelector' }).findAll('.year-selector__year')
			expect(yearButtons[0]!.text()).toBe('2100')
			expect(yearButtons[yearButtons.length - 1]!.text()).toBe('1900')

			await wrapper.setProps({ yearsOrder: 'asc' })

			const newYearButtons = wrapper.findComponent({ name: 'YearSelector' }).findAll('.year-selector__year')
			expect(newYearButtons[0]!.text()).toBe('1900')
			expect(newYearButtons[newYearButtons.length - 1]!.text()).toBe('2100')

			wrapper.unmount()
		})
	})

	describe('select current month btn', () => {
		it('should select the current month and year when a month is already selected', async () => {
			// mock current date to 15th March 2023
			const mockDate = new Date(2023, 2, 15)
			vi.setSystemTime(mockDate)
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')
			const modal = wrapper.findComponent({ name: 'VisualPickerFooter' })

			const currentMonthBtn = modal.find('.month-picker-footer__current-month-btn')
			await currentMonthBtn.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toEqual([['03/2023']]) // The value should be '03/2023' (March 2023)

			wrapper.unmount()
		})

		it('should select the current month and year when no month is selected', async () => {
			// mock current date to 15th March 2023
			const mockDate = new Date(2023, 2, 15)
			vi.setSystemTime(mockDate)
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: undefined,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')
			const modal = wrapper.findComponent({ name: 'VisualPickerFooter' })

			const currentMonthBtn = modal.find('.month-picker-footer__current-month-btn')
			await currentMonthBtn.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toEqual([['03/2023']]) // The value should be '03/2023' (March 2023)

			wrapper.unmount()
		})
	})

	describe('view switcher', () => {
		it('should switch to year selector when clicking on the switch view button in month selector', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const switchViewBtn = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn')
			await switchViewBtn.trigger('click')

			expect(wrapper.findComponent({ name: 'MonthSelector' }).exists()).toBeFalsy()
			expect(wrapper.findComponent({ name: 'YearSelector' }).isVisible()).toBeTruthy()

			wrapper.unmount()
		})

		it('should switch to month selector when clicking on the switch view button in year selector', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			const switchViewBtn = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn')
			await switchViewBtn.trigger('click')

			expect(wrapper.findComponent({ name: 'YearSelector' }).exists()).toBeFalsy()
			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()

			wrapper.unmount()
		})

		it('shows the year selector when the initialView prop is set to year', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					initialView: 'years',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			expect(wrapper.findComponent({ name: 'YearSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent({ name: 'MonthSelector' }).exists()).toBeFalsy()

			expect(document.activeElement?.classList).toContain('year-selector__year')
			wrapper.unmount()
		})

		it('shows the month selector when the initialView prop is set to month', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					initialView: 'months',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			expect(wrapper.findComponent({ name: 'MonthSelector' }).isVisible()).toBeTruthy()
			expect(wrapper.findComponent({ name: 'YearSelector' }).exists()).toBeFalsy()

			expect(document.activeElement?.classList).toContain('month-selector__month')
			wrapper.unmount()
		})

		it ('focuses the lowerst year when opening the year selector if no year is selected and the order is ascending', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					initialView: 'years',
					minYear: 2000,
					maxYear: 2020,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			expect(document.activeElement?.classList).toContain('year-2000')

			wrapper.unmount()
		})

		it ('focuses the highest year when opening the year selector if no year is selected and the order is descending', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					initialView: 'years',
					yearsOrder: 'desc',
					minYear: 2000,
					maxYear: 2020,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			expect(document.activeElement?.classList).toContain('year-2020')

			wrapper.unmount()
		})
	})

	describe('minYear and maxYear props', () => {
		it('should not display years inferior to minYear', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
					minYear: 2020,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2019').exists()).toBeFalsy()
			expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2020').exists()).toBeTruthy()

			wrapper.unmount()
		})

		it('should not display years superior to maxYear', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
					maxYear: 2025,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2026').exists()).toBeFalsy()
			expect(wrapper.findComponent({ name: 'YearSelector' }).find('.year-2025').exists()).toBeTruthy()

			wrapper.unmount()
		})
	})

	describe('visual/text input synchronization', () => {
		it('should update the text input when a month and year are selected in the visual picker', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2024')
			await yearButton.trigger('click')

			expect(wrapper.find('input').element.value).toBe('01/2024') // The input value should be '01/2024'

			wrapper.unmount()
		})

		it('should update the visual picker when the text input value changes', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.setValue('02/2026')

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-2') // February button
			expect(monthButton.classes()).toContain('month-selector__month--active')

			await wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn').trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2026')
			expect(yearButton.classes()).toContain('year-selector__year--active')

			wrapper.unmount()
		})

		it('handle correctly month and year that start with 0 in the text input', async () => {
			vi.setSystemTime(new Date(2023, 5, 15))
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '01/2025',
				},
				attachTo: document.body,
			})

			const input = wrapper.find('input')
			await input.setValue('02/025')

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const activeMonthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-2') // February button
			expect(activeMonthButton.classes()).toContain('month-selector__month--active')

			await wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-year-btn').trigger('click')

			const activeYearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-selector__year--active')
			expect(activeYearButton.text()).toBe('2023') // the selector fallback to the current year if the year is not in the range
			expect(activeYearButton.classes()).toContain('year-2023')

			await toggleBtn.trigger('click') // close the menu

			expect(wrapper.emitted('update:modelValue')).toEqual([['02/025']])
			expect(wrapper.find('input').element.value).toBe('02/025') // The input value should still be '02/025'

			wrapper.unmount()
			vi.useRealTimers()
		})
	})

	describe('visual picker header', () => {
		it('displays the current month and year when none is selected', async () => {
			// mock current date to 15th March 2023
			const mockDate = new Date(2023, 2, 15)
			vi.setSystemTime(mockDate)
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: undefined,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const headerText = wrapper
				.findComponent({ name: 'VisualPickerHeader' })
				.find('.visual-picker-header__date')
				.text()

			expect(headerText).toContain('March')
			expect(headerText).toContain('2023')

			wrapper.unmount()
		})

		it('displays the selected month and year', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const headerText = wrapper
				.findComponent({ name: 'VisualPickerHeader' })
				.find('.visual-picker-header__date')
				.text()
			expect(headerText).toBe('November 2025')

			wrapper.unmount()
		})

		it('displays the current month and year when the model value is invalid', async () => {
			// mock current date to 15th March 2023
			const mockDate = new Date(2023, 2, 15)
			vi.setSystemTime(mockDate)
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '00/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const headerText = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-header__date').text()
			expect(headerText).toBe('March 2023')

			wrapper.unmount()
		})

		it ('displays the current month and year when the model value year is not set', async () => {
			// mock current date to 15th March 2023
			const mockDate = new Date(2023, 2, 15)
			vi.setSystemTime(mockDate)
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '05/',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const headerText = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-header__date').text()
			expect(headerText).toBe('March 2023')

			wrapper.unmount()
		})
	})

	describe('disabled and readonly state', () => {
		it('does not update the model value when the field is disabled', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
					disabled: true,
				},
			})

			const input = wrapper.find('input')
			expect(input.attributes('disabled')).toBeDefined()

			await input.setValue('01/2027')
			expect(wrapper.emitted('update:modelValue')).toBeFalsy() // The value should not be emitted when the field is disabled

			wrapper.unmount()
		})

		it('does not open the visual picker when the field is disabled', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
					disabled: true,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			expect(toggleBtn.attributes('disabled')).toBeDefined()

			await toggleBtn.trigger('click')

			const modal = wrapper.findComponent({ name: 'MonthPickerVisual' }).find('.month-picker-menu')
			expect(modal.exists()).toBeFalsy() // The month buttons should not be rendered when the field is disabled

			wrapper.unmount()
		})

		it('does not update the model value when the field is readonly', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
					readonly: true,
				},
			})

			const input = wrapper.find('input')
			expect(input.attributes('readonly')).toBeDefined()

			await input.setValue('01/2027')
			expect(wrapper.emitted('update:modelValue')).toBeFalsy() // The value should not be emitted when the field is readonly

			wrapper.unmount()
		})

		it('does not update the model value when the visual picker is used and the field is readonly', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
					readonly: true,
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1')
			await monthButton.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2024')
			await yearButton.trigger('click')

			expect(wrapper.emitted('update:modelValue')).toBeFalsy()
			expect(wrapper.emitted('update:open')).toEqual([[true], [false]])
			expect(wrapper.find('input').element.value).toBe('11/2025')

			wrapper.unmount()
		})
	})

	describe('localization', () => {
		afterEach(() => {
			// reset navigator.language to default value after each test
			Object.defineProperty(navigator, 'language', {
				value: 'en-US',
				writable: true,
			})
		})

		it('should display month names in english when the browser locale is english', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Start of the project',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			expect(monthButton.attributes('aria-label')).toBe('January')
			expect(monthButton.text()).toBe('Jan')
		})

		it('should display month names in french when the browser locale is french', async () => {
			// mock navigator.language to french
			Object.defineProperty(navigator, 'language', {
				value: 'fr-FR',
				writable: true,
			})
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			expect(monthButton.attributes('aria-label')).toBe('janvier')
			expect(monthButton.text()).toBe('janv.')

			wrapper.unmount()
		})

		it('display the date in the header according to the locale', async () => {
			// mock navigator.language to french
			Object.defineProperty(navigator, 'language', {
				value: 'fr-FR',
				writable: true,
			})
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					modelValue: '11/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const headerText = wrapper
				.findComponent({ name: 'VisualPickerHeader' })
				.find('.visual-picker-header__date')
				.text()

			expect(headerText).toBe('novembre 2025') // The header should display the date in the format "month year" in lowercase and in french

			wrapper.unmount()
		})

		it('display the date in the header according to the locale', async () => {
			// mock navigator.language to German
			Object.defineProperty(navigator, 'language', {
				value: 'de-DE',
				writable: true,
			})
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Projektbeginn',
					modelValue: '02/2025',
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const headerText = wrapper
				.findComponent({ name: 'VisualPickerHeader' })
				.find('.visual-picker-header__date')
				.text()

			expect(headerText).toBe('Februar 2025') // The header should display the date in the format "month year" in German

			wrapper.unmount()
		})
	})
	describe('validation', () => {
		it('show the error message when the input value is invalid', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: string) => {
								const regex = /^(0[1-9]|1[0-2])\/\d{4}$/
								return regex.test(value) || 'Invalid month/year format. Use MM/YYYY.'
							},
							message: 'Invalid month/year format. Use MM/YYYY.',
						},
					}],
				},
			})

			const input = wrapper.find('input')
			await input.setValue('99/2025')
			await input.trigger('blur')

			expect(wrapper.find('.v-field--error').exists()).toBe(true)
			expect(wrapper.find('.v-input__details').text()).toBe('Invalid month/year format. Use MM/YYYY.')

			wrapper.unmount()
		})

		it('should not show an error message when the input value is valid', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: string) => {
								const regex = /^(0[1-9]|1[0-2])\/\d{4}$/
								return regex.test(value) || 'Invalid month/year format. Use MM/YYYY.'
							},
							message: 'Invalid month/year format. Use MM/YYYY.',
						},
					}],
				},
			})

			const input = wrapper.find('input')
			await input.setValue('12/2025')
			await input.trigger('blur')

			expect(wrapper.find('.v-field--error').exists()).toBe(false)
			expect(wrapper.find('.v-input__details').text()).toBe('Format MM/AAAA')

			wrapper.unmount()
		})

		it ('show the error when the value is selected in the visual picker', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					label: 'Début du projet',
					customRules: [{
						type: 'custom',
						options: {
							validate: (value: string) => {
								const year = value.split('/')[1]
								return !!year && parseInt(year!) >= 2026
							},
							message: 'The year must be 2026 or later.',
						},
					}],
				},
				attachTo: document.body,
			})

			// Wait for the VMenu to resolve the differents ref used to find the activator element
			await nextTick()
			await nextTick()

			const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
			await toggleBtn.trigger('click')

			const monthButton = wrapper.findComponent({ name: 'MonthSelector' }).find('.month-1') // January button
			await monthButton.trigger('click')

			const yearButton = wrapper.findComponent({ name: 'YearSelector' }).find('.year-2025')
			await yearButton.trigger('click')

			expect(wrapper.find('.v-field--error').exists()).toBe(true)
			expect(wrapper.find('.v-input__details').text()).toBe('The year must be 2026 or later.')

			wrapper.unmount()
		})
	})
})
