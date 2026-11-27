// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaAlert from '../CaptchaAlert.vue'
import { locales } from '../locales'
describe('CaptchaAlert – RGAA contract', () => {
	it('exposes an alert and renewal text', () => {
		const wrapper = mount(CaptchaAlert, { props: { locales } })
		expect(wrapper.find('[role="alert"]').exists()).toBe(true)
		expect(wrapper.text()).toContain(locales.renew)
	})
})
