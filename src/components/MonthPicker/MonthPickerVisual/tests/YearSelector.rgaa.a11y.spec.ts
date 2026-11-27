// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import YearSelector from '../YearSelector.vue'
import { locales, localesKey } from '../../locales'
describe('YearSelector – RGAA contract', () => {
	it('7.1 and 8.2 – exposes one active year in a labelled group', () => {
		const wrapper = mount(YearSelector, { props: { min: 2025, max: 2027, order: 'asc', modelValue: 2026 }, global: { provide: { [localesKey as symbol]: locales } } })
		expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe(locales.yearSelectorLabel)
		expect(wrapper.findAll('button[tabindex="0"]')).toHaveLength(1)
	})
})
