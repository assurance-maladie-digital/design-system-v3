import { describe, expect, it } from 'vitest'
import LunarCalendar from '../LunarCalendar.vue'
import { mount } from '@vue/test-utils'

describe('LunarCalendar', () => {
	it('renders correctly', () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				modelValue: '10/19/1995',
			},
		})

		expect(wrapper.exists()).toBe(true)
		expect(wrapper.html()).toContain('10/19/1995')
	})

	it('emits update:modelValue on date change', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				modelValue: '10/19/1995',
			},
		})

		wrapper.find('input').setValue('11/20/1995')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')![0]).toEqual(['11/20/1995'])
	})

	it('autoformats date input', async () => {
		const wrapper = mount(LunarCalendar, {
			props: {
				modelValue: '',
			},
		})

		const input = wrapper.find('input')
		await input.setValue('11201995')

		expect(input.element.value).toBe('11/20/1995')
	})

	describe('rules', () => {
		it('validates minDate rule', async () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					modelValue: '10/19/1995',
					minYear: 1996,
				},
			})

			const input = wrapper.find('input')
			await input.setValue('10/19/1995')
			await input.trigger('blur')

			expect(wrapper.html()).toContain('L\'année doit être supérieure ou égale à 1996.')
		})

		it('validates maxDate rule', async () => {
			const wrapper = mount(LunarCalendar, {
				props: {
					modelValue: '10/19/1995',
					maxYear: 1994,
				},
			})

			const input = wrapper.find('input')
			await input.setValue('10/19/1995')
			await input.trigger('blur')

			expect(wrapper.html()).toContain('L\'année doit être inférieure ou égale à 1994.')
		})
	})
})
