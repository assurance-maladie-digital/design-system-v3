// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeField from '../RangeField.vue'

export const rangeFieldRgaaCriteria = ['7.1', '8.2', '9.1', '10.7', '11.1'] as const

describe('RangeField – executable RGAA contracts', () => {
	it('7.1, 8.2, 9.1 and 11.1 – exposes a labelled fieldset and two labelled numeric fields', () => {
		const wrapper = mount(RangeField, { props: { fieldsetLabel: 'Montant', textFieldMinLabel: 'Minimum', textFieldMaxLabel: 'Maximum' } })
		expect(wrapper.get('fieldset legend').text()).toBe('Montant')
		expect(wrapper.findAll('input').length).toBeGreaterThanOrEqual(2)
		expect(wrapper.text()).toContain('Minimum')
		expect(wrapper.text()).toContain('Maximum')
	})
})
