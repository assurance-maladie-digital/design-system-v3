// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PhoneField from '../PhoneField.vue'

export const phoneFieldRgaaCriteria = ['1.2', '3.2', '7.1', '7.3', '7.5', '8.7', '8.8', '10.1', '11.5', '11.6', '11.7', '11.10', '11.11', '11.13'] as const

describe('PhoneField – executable RGAA contracts', () => {
	it('11.7 and 11.10 – exposes a named phone input', () => {
		const wrapper = mount(PhoneField, { props: { modelValue: '', required: true } })
		expect(wrapper.get('input').attributes('type')).toBe('tel')
		expect(wrapper.findAll('label').length).toBeGreaterThan(0)
	})
})
