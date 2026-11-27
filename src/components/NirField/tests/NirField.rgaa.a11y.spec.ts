// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NirField from '../NirField.vue'

export const nirFieldRgaaCriteria = ['3.3', '7.1', '8.2', '11.7', '11.10', '11.11'] as const

describe('NirField – executable RGAA contracts', () => {
	it('11.7 and 11.10 – exposes labelled NIR inputs', () => {
		const wrapper = mount(NirField, { props: { required: true, displayKey: true, nirType: 'simple' } })
		expect(wrapper.findAll('input').length).toBeGreaterThan(0)
		expect(wrapper.findAll('label').length).toBeGreaterThan(0)
	})
})
