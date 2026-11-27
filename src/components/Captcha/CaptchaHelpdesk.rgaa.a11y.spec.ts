// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaHelpdesk from './CaptchaHelpdesk.vue'

export const captchaHelpdeskRgaaCriteria = ['8.2', '13.3'] as const
describe('CaptchaHelpdesk – executable RGAA contracts', () => {
	it('8.2 and 13.3 – exposes the support number as a telephone link', () => {
		const wrapper = mount(CaptchaHelpdesk, { props: { phoneNumber: '3646', localizedMessage: phone => `Besoin d’aide ? Appelez le ${phone}` } })
		expect(wrapper.get('a').attributes('href')).toBe('tel:3646')
		expect(wrapper.get('a').text()).toBe('3646')
	})
})
