// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DiacriticPicker from '../DiacriticPicker.vue'

export const diacriticPickerRgaaCriteria = ['7.1', '8.2', '10.7', '11.10', '13.3'] as const

describe('DiacriticPicker – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.10 – names the dialog trigger and exposes its relationship', () => {
		const wrapper = mount(DiacriticPicker, { props: { btnTitle: 'éÉ', inputAriaLabel: 'Texte' } })
		const button = wrapper.get('button')
		expect(button.attributes('aria-label')).toContain('éÉ')
		expect(button.attributes('aria-haspopup')).toBe('dialog')
		expect(button.attributes('aria-controls')).toBeTruthy()
	})
})
