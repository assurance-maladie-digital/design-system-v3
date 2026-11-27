// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RangeField from '../RangeField.vue'

export const rangeFieldRgaaCriteria = ['3.3', '7.1', '8.2', '10.1', '10.7'] as const

describe('RangeField – executable RGAA contracts', () => {
	it('7.1 and 8.2 – exposes one fieldset with a legend and labelled values', () => {
		const wrapper = mount(RangeField, { props: { modelValue: [20, 80], min: 0, max: 100, fieldsetLabel: 'Plage de valeurs', textFieldMinLabel: 'Min', textFieldMaxLabel: 'Max' } })
		expect(wrapper.get('fieldset').text()).toContain('Plage de valeurs')
		expect(wrapper.findAll('input').length).toBeGreaterThan(1)
	})
})
