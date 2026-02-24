import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MonthPicker from '../MonthPicker.vue'
import { nextTick } from 'vue'

describe('mounthpicker', () => {
	it('should render mounthpicker', () => {
		const wrapper = mount(MonthPicker, {
			props: {
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
			const wrapper = mount(MonthPicker)

			const input = wrapper.find('input')
			await input.setValue('01/2027')
			expect(wrapper.emitted('update:modelValue')).toBeTruthy()
			expect(wrapper.emitted('update:modelValue')).toEqual([['01/2027']])
		})

		it('should emit multiple update:modelValue when the input value changes multiple times', async () => {
			const wrapper = mount(MonthPicker)
			const input = wrapper.find('input')

			await input.setValue('01/2027')
			await input.setValue('02/2027')
			await input.setValue('03/2030')

			expect(wrapper.emitted('update:modelValue')).toEqual([['01/2027'], ['02/2027'], ['03/2030']])
		})

		it('shows the correct value in the input when modelValue prop changes', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
					modelValue: '11/2025',
				},
			})

			expect(wrapper.find('input').element.value).toBe('11/2025')

			await wrapper.setProps({ modelValue: '12/2026' })
			expect(wrapper.find('input').element.value).toBe('12/2026')
		})
	})

	describe('MonthPickerVisual', () => {
		it('should emit update:modelValue when a month is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
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

			expect(wrapper.emitted('update:modelValue')![0]![0]).toBe('01/2025') // The month part of the value should be '01'
		})

		it('shows the year picker after the month is selected', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
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
		})

		it('show the selected month in the visual month picker', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
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
		})

		it('show the correct year in the visual year picker', async () => {
			const wrapper = mount(MonthPicker, {
				props: {
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
		})

		describe('keyboard navigation', () => {
			it('should navigate through months using arrow keys', async () => {
				const wrapper = mount(MonthPicker, {
					props: {
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
			})

			it('should navigate through years using arrow keys', async () => {
				const wrapper = mount(MonthPicker, {
					props: {
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
			})
		})
	})
})
