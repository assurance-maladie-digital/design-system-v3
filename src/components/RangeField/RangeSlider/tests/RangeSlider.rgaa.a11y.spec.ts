// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeSlider from '../RangeSlider.vue'
describe('RangeSlider – RGAA contract', () => {
	it('7.1 and 11.1 – exposes two labelled horizontal sliders', () => {
		const wrapper = mount(RangeSlider, { props: { modelValue: [20, 80], min: 0, max: 100, minLabel: 'Minimum', maxLabel: 'Maximum' } })
		expect(wrapper.findAll('[role="slider"]')).toHaveLength(2)
		expect(wrapper.get('.thumb-min').attributes('aria-label')).toBe('Minimum')
		expect(wrapper.get('.thumb-max').attributes('aria-label')).toBe('Maximum')
	})
})
