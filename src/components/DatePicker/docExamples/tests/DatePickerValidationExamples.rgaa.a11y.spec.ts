// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Example from '../DatePickerValidationExamples.vue'
describe('DatePickerValidationExamples – RGAA contract', () => {
	it('8.2 and 11.1 – exposes labelled validation examples', () => {
		const wrapper = shallowMount(Example, { global: { stubs: { DatePicker: { template: '<input aria-label="Date" />' }, SyHeading: { props: { level: Number }, template: '<component :is="`h${level || 2}`"><slot /></component>' }, VBtn: { template: '<button><slot /></button>' } } } })
		expect(wrapper.find('h1').exists()).toBe(true)
		expect(wrapper.findAll('input[aria-label="Date"]').length).toBeGreaterThan(1)
	})
})
