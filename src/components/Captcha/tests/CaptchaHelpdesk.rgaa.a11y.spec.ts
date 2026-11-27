// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaHelpdesk from '../CaptchaHelpdesk.vue'
describe('CaptchaHelpdesk – RGAA contract', () => {
	it('exposes a telephone link', () => expect(mount(CaptchaHelpdesk, { props: { phoneNumber: '3646', localizedMessage: phone => phone } }).get('a').attributes('href')).toBe('tel:3646'))
})
