// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyCheckbox from '../SyCheckbox.vue'

export const syCheckboxRgaaCriteria = ['1.2', '3.3', '7.1', '7.3', '8.2', '9.3', '10.7', '11.10'] as const

describe('SyCheckbox – executable RGAA contracts', () => {
	it('7.1, 7.3 and 11.10 – exposes a labelled checkbox', () => {
		const wrapper = mount(SyCheckbox, { props: { label: 'J’accepte', modelValue: false, required: true } })
		expect(wrapper.get('input[type="checkbox"]').exists()).toBe(true)
		expect(wrapper.text()).toContain('J’accepte')
	})
})
