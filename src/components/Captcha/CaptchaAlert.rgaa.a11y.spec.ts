// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaAlert from './CaptchaAlert.vue'
import { locales } from './locales'

export const captchaAlertRgaaCriteria = ['7.1', '8.2', '9.1'] as const
describe('CaptchaAlert – executable RGAA contracts', () => {
	it('7.1 and 8.2 – exposes an alert with a named renewal action', () => {
		const wrapper = mount(CaptchaAlert, { props: { locales }, slots: { default: 'Le CAPTCHA n’a pas pu être chargé.' } })
		expect(wrapper.find('[role="alert"]').exists()).toBe(true)
		expect(wrapper.text()).toContain(locales.renew)
	})
})
