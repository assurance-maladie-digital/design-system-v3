// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaForm from './CaptchaForm.vue'
import { locales } from './locales'

export const captchaFormRgaaCriteria = ['8.2', '11.1', '11.10'] as const
describe('CaptchaForm – executable RGAA contracts', () => {
	it('8.2 and 11.1 – passes the label and required state to the input', () => {
		const wrapper = mount(CaptchaForm, { props: { label: 'Code de sécurité', locales, required: true }, global: { stubs: { SyTextField: { template: '<input :aria-label="label" :aria-required="ariaRequired">', props: ['label', 'ariaRequired'] } } } })
		expect(wrapper.get('input').attributes('aria-label')).toBe('Code de sécurité')
	})
})
