// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from '../Tooltip.vue'
describe('RangeSlider Tooltip – RGAA contract', () => {
	it('1.2 – keeps the visual tooltip as plain contextual content', () => {
		const wrapper = mount(Tooltip, { slots: { default: '50' } })
		expect(wrapper.get('.tooltip').text()).toBe('50')
		expect(wrapper.get('.tooltip').attributes('role')).toBeUndefined()
	})
})
