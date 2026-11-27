// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePickerYearOption from '../../components/DatePickerYearOption.vue'
describe('DatePickerYearOption – RGAA contract', () => {
	it('8.9 – exposes a labelled selected grid cell', () => {
		const wrapper = mount(DatePickerYearOption, { props: { slotProps: { year: { text: '2026', value: 2026 }, i: 0, props: { active: true } } } })
		expect(wrapper.get('[role="gridcell"]').attributes('aria-label')).toBe('2026')
		expect(wrapper.get('[role="gridcell"]').attributes('aria-selected')).toBe('true')
	})
})
