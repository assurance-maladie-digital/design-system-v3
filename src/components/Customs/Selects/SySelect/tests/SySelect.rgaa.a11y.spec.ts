// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SySelect from '../SySelect.vue'

export const sySelectRgaaCriteria = ['1.2', '7.1', '7.3', '8.2', '11.13'] as const

describe('SySelect – executable RGAA contracts', () => {
	it('7.1 and 11.13 – exposes a labelled combobox input', () => {
		const wrapper = mount(SySelect, { props: { label: 'Choisissez une option', items: ['Un', 'Deux'], required: true } })
		expect(wrapper.get('input').attributes('aria-labelledby')).toBeTruthy()
		expect(wrapper.text()).toContain('Choisissez une option')
	})
})
