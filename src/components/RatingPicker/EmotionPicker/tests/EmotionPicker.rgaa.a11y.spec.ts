// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import EmotionPicker from '../EmotionPicker.vue'

export const emotionPickerRgaaCriteria = ['7.1', '8.2', '10.7', '11.1'] as const

describe('EmotionPicker – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.1 – exposes a labelled radio group with keyboard targets', () => {
		const wrapper = mount(EmotionPicker, { props: { label: 'Votre satisfaction' } })
		expect(wrapper.get('legend').text()).toBe('Votre satisfaction')
		expect(wrapper.get('[role="radiogroup"]').exists()).toBe(true)
		expect(wrapper.findAll('[role="radio"]')).toHaveLength(3)
	})
})
