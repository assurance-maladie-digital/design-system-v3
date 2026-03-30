// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import MonthPicker from '../MonthPicker.vue'

describe('MonthPicker – accessibility (axe)', () => {
	it('has no obvious axe violations modal closed', async () => {
		const wrapper = mount(MonthPicker, {
			props: {
				label: 'Select month and year',
				modelValue: undefined,
			},
			attachTo: document.body,
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MonthPicker – closed')

		wrapper.unmount()
	})

	it('has no obvious axe violations modal open', async () => {
		const wrapper = mount(MonthPicker, {
			props: {
				label: 'Select month and year',
				modelValue: '03/2023',
			},
			attachTo: document.body,
		})

		// Wait for the VMenu to resolve the differents ref used to find the activator element
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
		await toggleBtn.trigger('click')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MonthPicker – open')

		wrapper.unmount()
	})

	it('has no obvious axe violations on the year modal view', async () => {
		const wrapper = mount(MonthPicker, {
			props: {
				label: 'Select month and year',
				modelValue: '03/2023',
			},
			attachTo: document.body,
		})

		// Wait for the VMenu to resolve the differents ref used to find the activator element
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		const toggleBtn = wrapper.find('.month-picker-input__toggle-btn')
		await toggleBtn.trigger('click')

		const headerBtn = wrapper.findComponent({ name: 'VisualPickerHeader' }).find('.visual-picker-header__date')
		await headerBtn.trigger('click')

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'MonthPicker – year view')

		wrapper.unmount()
	})
})
