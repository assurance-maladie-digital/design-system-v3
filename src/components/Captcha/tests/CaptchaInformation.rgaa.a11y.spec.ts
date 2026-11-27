// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaInformation from '../CaptchaInformation.vue'
import { locales } from '../locales'
describe('CaptchaInformation – RGAA contract', () => {
	it('exposes a heading', () => expect(mount(CaptchaInformation, { props: { type: 'image', locales } }).find('h3').exists()).toBe(true))
})
