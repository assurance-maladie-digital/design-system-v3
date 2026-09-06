import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DatePickerLite from '../DatePickerLite.vue'

// jsdom does not compute `:focus-visible`: we check here the structural prerequisites of the
// scoped DS rings (real focusable buttons + roving-tabindex pattern of the grids), the actual
// ring rendering being covered by the Cypress visual tests.
describe('DatePickerLite - Focus', () => {
	it('renders the picker toggle as a focusable native button (scoped DS ring)', () => {
		const wrapper = mount(DatePickerLite, { props: { label: 'Date', modelValue: new Date(2025, 2, 3) } })
		const toggle = wrapper.find('.date-picker-lite-input__toggle-btn')

		expect(toggle.exists()).toBe(true)
		expect(toggle.element.tagName).toBe('BUTTON')
		expect(toggle.attributes('tabindex')).not.toBe('-1')
	})

	it('exposes a focusable text input (primary field border)', () => {
		const wrapper = mount(DatePickerLite, { props: { label: 'Date', modelValue: new Date(2025, 2, 3) } })
		const input = wrapper.find('input')

		expect(input.exists()).toBe(true)
		expect(input.attributes('tabindex')).not.toBe('-1')
	})

	it('uses a single roving tabindex across the calendar day cells (keyboard nav)', async () => {
		const wrapper = mount(DatePickerLite, {
			props: { label: 'Date', modelValue: new Date(2026, 8, 4) },
			attachTo: document.body,
		})
		await nextTick()
		await nextTick()
		await wrapper.find('.date-picker-lite-input__toggle-btn').trigger('click')
		await nextTick()

		const days = wrapper.findComponent({ name: 'Calendar' }).findAll('[data-date]')
		expect(days.length).toBeGreaterThanOrEqual(28)
		const tabbable = days.filter(b => b.attributes('tabindex') === '0')
		expect(tabbable).toHaveLength(1)

		wrapper.unmount()
	})
})
