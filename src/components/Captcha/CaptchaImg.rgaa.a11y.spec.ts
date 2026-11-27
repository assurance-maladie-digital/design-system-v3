// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaImg from './CaptchaImg.vue'
import { locales } from './locales'

export const captchaImgRgaaCriteria = ['1.2', '1.3'] as const
describe('CaptchaImg – executable RGAA contracts', () => {
	it('1.3 – gives the CAPTCHA image a meaningful alternative', () => {
		const wrapper = mount(CaptchaImg, { props: { state: 'resolved', src: '/captcha.png', locales } })
		expect(wrapper.get('img').attributes('alt')).toBe(locales.captchaImgAlt)
	})
})
