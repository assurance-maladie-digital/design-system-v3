// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaForm from '../CaptchaForm.vue'
import { locales } from '../locales'
describe('CaptchaForm – RGAA contract', () => {
	it('passes the label to its field', () => {
		const wrapper = mount(CaptchaForm, { props: { label: 'Code de sécurité', locales }, global: { stubs: { SyTextField: { template: '<input :aria-label="label">', props: ['label'] } } } })
		expect(wrapper.get('input').attributes('aria-label')).toBe('Code de sécurité')
	})
})
