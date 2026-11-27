// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaImg from '../CaptchaImg.vue'
import { locales } from '../locales'
describe('CaptchaImg – RGAA contract', () => {
	it('exposes alternative text', () => expect(mount(CaptchaImg, { props: { state: 'resolved', src: '/captcha.png', locales } }).get('img').attributes('alt')).toBe(locales.captchaImgAlt))
})
