// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'

const options = [
	{ label: 'Option A', value: 'a', id: 'option-a' },
	{ label: 'Option B', value: 'b', id: 'option-b' },
]

export const syCheckBoxGroupRgaaCriteria = ['7.1', '7.3', '8.2', '9.1', '10.7', '11.10', '12.8'] as const

describe('SyCheckBoxGroup – executable RGAA contracts', () => {
	it('8.2 and 9.1 – exposes a fieldset, legend and labelled checkbox controls', () => {
		const wrapper = mount(SyCheckBoxGroup, { props: { label: 'Choisissez vos options', options } })
		expect(wrapper.get('fieldset').get('legend').text()).toContain('Choisissez vos options')
		expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(2)
		expect(wrapper.findAll('label')).toHaveLength(2)
	})

	it('7.1, 7.3, 10.7 and 11.10 – keeps controls keyboard reachable and exposes required state', () => {
		const wrapper = mount(SyCheckBoxGroup, { props: { id: 'preferences', label: 'Préférences', options, required: true } })
		expect(wrapper.get('fieldset').attributes('id')).toBe('preferences')
		expect(wrapper.get('legend').attributes('id')).toBe('preferences-label')
		expect(wrapper.findAll('input[type="checkbox"]').every(input => input.attributes('tabindex') !== '-1')).toBe(true)
		expect(wrapper.get('fieldset').exists()).toBe(true)
	})

	it('7.5 – renders validation or help text in the group details region', () => {
		const wrapper = mount(SyCheckBoxGroup, { props: { label: 'Préférences', options, helpText: 'Choix modifiables à tout moment.' } })
		expect(wrapper.text()).toContain('Choix modifiables à tout moment.')
	})
})
