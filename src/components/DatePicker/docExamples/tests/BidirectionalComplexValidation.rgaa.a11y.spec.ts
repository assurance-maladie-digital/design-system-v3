// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Example from '../BidirectionalComplexValidation.vue'
describe('BidirectionalComplexValidation – RGAA contract', () => {
	it('8.2 and 11.1 – keeps both validation date fields available', () => {
		const wrapper = shallowMount(Example, { global: { stubs: { DatePicker: { template: '<input aria-label="Date" />' }, SyHeading: { template: '<h2><slot /></h2>' } } } })
		expect(wrapper.findAll('input[aria-label="Date"]')).toHaveLength(2)
	})
})
