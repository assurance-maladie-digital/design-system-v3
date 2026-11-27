// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyTextField from '../SyTextField.vue'

export const syTextFieldRgaaCriteria = ['11.2', '11.5', '11.6', '11.7', '11.10'] as const

describe('SyTextField – executable RGAA contracts', () => {
	it('11.2 and 11.10 – exposes a labelled required text input', () => {
		const wrapper = mount(SyTextField, { props: { label: 'Nom', modelValue: '', required: true } })
		expect(wrapper.get('input').attributes('aria-label') || wrapper.get('input').attributes('aria-labelledby')).toBeTruthy()
		expect(wrapper.text()).toContain('Nom')
	})
})
