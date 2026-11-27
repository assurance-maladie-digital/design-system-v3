// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CaptchaBase from '../CaptchaBase.vue'
import { locales } from '../locales'

describe('CaptchaBase – RGAA contract', () => {
	it('7.1 and 8.2 – keeps the selected captcha mode content available to assistive technology', () => {
		const wrapper = mount(CaptchaBase, {
			props: {
				modelValue: 'choice',
				urlCreate: '/captcha/create',
				urlGetImage: '/captcha/image',
				urlGetAudio: '/captcha/audio',
				locale: 'fr',
				locales,
			},
			slots: { default: '<p data-test="captcha-choice">Choisissez un captcha</p>' },
		})

		expect(wrapper.get('.captcha').find('[data-test="captcha-choice"]').text()).toBe('Choisissez un captcha')
		expect(wrapper.get('.captcha').element.tagName).toBe('DIV')
	})
})
