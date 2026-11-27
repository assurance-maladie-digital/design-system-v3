// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StarsPicker from '../StarsPicker.vue'

export const starsPickerRgaaCriteria = ['7.1', '8.2', '10.7', '11.1'] as const

describe('StarsPicker – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.1 – exposes a labelled radio group and text alternatives for stars', () => {
		const wrapper = mount(StarsPicker, { props: { label: 'Évaluation', length: 5 } })
		expect(wrapper.get('legend').text()).toBe('Évaluation')
		expect(wrapper.findAll('[role="radio"]')).toHaveLength(5)
		expect(wrapper.findAll('.d-sr-only')).toHaveLength(5)
	})
})
