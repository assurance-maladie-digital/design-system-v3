// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaInformation from './CaptchaInformation.vue'
import { locales } from './locales'

export const captchaInformationRgaaCriteria = ['8.2', '9.1'] as const
describe('CaptchaInformation – executable RGAA contracts', () => {
	it('8.2 and 9.1 – exposes a heading and contextual instructions', () => {
		const wrapper = mount(CaptchaInformation, { props: { type: 'image', locales } })
		expect(wrapper.get('h3').text()).toBe(locales.information.securityCheck)
		expect(wrapper.find('.captcha-instructions').exists()).toBe(true)
	})
})
