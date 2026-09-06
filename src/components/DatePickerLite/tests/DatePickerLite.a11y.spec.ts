// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import DatePickerLite from '../DatePickerLite.vue'

describe('DatePickerLite – accessibility (axe)', () => {
	it('has no obvious axe violations modal closed', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Select a date',
				modelValue: undefined,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'DatePickerLite – closed')

		wrapper.unmount()
	})

	it('has no obvious axe violations days view open', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Select a date',
				modelValue: new Date(2023, 2, 3),
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const toggleBtn = wrapper.find('.date-picker-lite-input__toggle-btn')
		await toggleBtn.trigger('click')

		const menu = document.body.querySelector('.date-picker-lite-menu') as HTMLElement
		const results = await axe(menu)
		assertNoA11yViolations(results, 'DatePickerLite – days view')

		wrapper.unmount()
	})

	it('has no obvious axe violations months view open', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Select a date',
				modelValue: new Date(2023, 2, 3),
				initialView: 'months',
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const toggleBtn = wrapper.find('.date-picker-lite-input__toggle-btn')
		await toggleBtn.trigger('click')

		const menu = document.body.querySelector('.date-picker-lite-menu') as HTMLElement
		const results = await axe(menu)
		assertNoA11yViolations(results, 'DatePickerLite – months view')

		wrapper.unmount()
	})

	it('has no obvious axe violations years view open', async () => {
		const wrapper = mount(DatePickerLite, {
			props: {
				label: 'Select a date',
				modelValue: new Date(2023, 2, 3),
				initialView: 'years',
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const toggleBtn = wrapper.find('.date-picker-lite-input__toggle-btn')
		await toggleBtn.trigger('click')

		const menu = document.body.querySelector('.date-picker-lite-menu') as HTMLElement
		const results = await axe(menu)
		assertNoA11yViolations(results, 'DatePickerLite – years view')

		wrapper.unmount()
	})
})
