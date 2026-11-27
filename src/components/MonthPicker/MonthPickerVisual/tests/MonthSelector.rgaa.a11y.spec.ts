// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MonthSelector from '../MonthSelector.vue'
import { locales, localesKey } from '../../locales'
describe('MonthSelector – RGAA contract', () => {
	it('7.1 and 8.2 – exposes a labelled roving set of month buttons', () => {
		const wrapper = mount(MonthSelector, { props: { modelValue: 3 }, global: { provide: { [localesKey as symbol]: locales } } })
		expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe(locales.monthSelectorLabel)
		expect(wrapper.findAll('button[tabindex="0"]')).toHaveLength(1)
	})
})
