// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Example from '../DatePickerSyFormValidity.vue'
describe('DatePickerSyFormValidity – RGAA contract', () => {
	it('7.1, 8.2 and 11.1 – exposes status and submit controls in the example', () => {
		const wrapper = shallowMount(Example, { props: { mode: 'calendar' }, global: { stubs: { SyForm: { template: '<form><slot /></form>' }, DatePicker: { template: '<input aria-label="Date" />' }, VBtn: { template: '<button :type="$attrs.type"><slot /></button>' } } } })
		expect(wrapper.find('[role="status"]').exists()).toBe(true)
		expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
	})
})
