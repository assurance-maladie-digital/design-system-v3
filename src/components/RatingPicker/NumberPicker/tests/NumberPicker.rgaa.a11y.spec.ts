// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberPicker from '../NumberPicker.vue'

export const numberPickerRgaaCriteria = ['7.1', '8.2', '10.7', '11.1', '11.10'] as const

describe('NumberPicker – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.10 – exposes named numeric radio options', () => {
		const wrapper = mount(NumberPicker, { props: { label: 'Note', length: 3 } })
		expect(wrapper.get('legend').text()).toBe('Note')
		expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
		expect(wrapper.get('[role="radio"]').attributes('aria-label')).toBeTruthy()
	})
})
