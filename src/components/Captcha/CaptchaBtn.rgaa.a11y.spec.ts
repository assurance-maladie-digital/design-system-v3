// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaBtn from './CaptchaBtn.vue'

export const captchaBtnRgaaCriteria = ['7.1', '10.7'] as const
describe('CaptchaBtn – executable RGAA contracts', () => {
	it('7.1 and 10.7 – is a native keyboard-focusable button', () => {
		const wrapper = mount(CaptchaBtn, { slots: { default: 'Écouter le code' } })
		expect(wrapper.get('button').attributes('type')).toBe('button')
		expect(wrapper.get('button').text()).toContain('Écouter le code')
	})
})
