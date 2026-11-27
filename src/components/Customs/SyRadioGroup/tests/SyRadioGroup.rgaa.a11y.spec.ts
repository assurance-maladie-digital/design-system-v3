// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyRadioGroup from '../SyRadioGroup.vue'

export const syRadioGroupRgaaCriteria = ['7.1', '8.2', '10.7', '11.1', '11.10'] as const

describe('SyRadioGroup – executable RGAA contracts', () => {
	it('7.1, 8.2, 11.1 and 11.10 – exposes a named radio group and labelled radios', () => {
		const wrapper = mount(SyRadioGroup, {
			props: { id: 'choice', label: 'Choix', options: [{ label: 'Oui', value: 'yes' }, { label: 'Non', value: 'no' }] },
		})
		expect(wrapper.get('[role="radiogroup"]').exists()).toBe(true)
		expect(wrapper.findAll('input[type="radio"]')).toHaveLength(2)
		expect(wrapper.text()).toContain('Choix')
	})
})
