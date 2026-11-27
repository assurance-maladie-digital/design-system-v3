// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePickerMonthOption from '../../components/DatePickerMonthOption.vue'
describe('DatePickerMonthOption – RGAA contract', () => {
	it('8.9 – exposes the month label', () => {
		const wrapper = mount(DatePickerMonthOption, { props: { slotProps: { month: { text: 'Mars', label: 'Mars', value: 3 }, i: 0, props: { active: false } } } })
		expect(wrapper.get('[role="gridcell"]').attributes('aria-label')).toBe('Mars')
	})
})
