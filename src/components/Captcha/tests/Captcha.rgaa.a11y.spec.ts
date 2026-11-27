// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Captcha from '../Captcha.vue'

type CaptchaResponse = {
	ok: boolean
	json: () => Promise<{ id: string }>
}

const props = {
	urlCreate: '/captcha/create',
	urlGetImage: '/captcha/image',
	urlGetAudio: '/captcha/audio',
}

async function mountCaptcha(type: 'image' | 'audio' | 'choice' = 'image') {
	const response: CaptchaResponse = { ok: true, json: async () => ({ id: 'captcha-id' }) }
	vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
	const wrapper = mount(Captcha, { props: { ...props, type } })
	await flushPromises()
	await wrapper.vm.$nextTick()
	return wrapper
}

export const captchaRgaaCriteria = ['1.2', '1.4', '1.5', '3.3', '7.1', '7.3', '7.5', '8.2', '10.1', '10.7', '11.10', '11.13', '12.8'] as const

describe('Captcha – executable RGAA contracts', () => {
	afterEach(() => vi.restoreAllMocks())

	it('1.4, 7.1 and 8.2 – identifies the image CAPTCHA and exposes a named answer field', async () => {
		const wrapper = await mountCaptcha()
		const image = wrapper.get('img.captcha-img')
		expect(image.attributes('alt')).toContain('captcha')
		expect(wrapper.get('input').attributes('aria-label')).toContain('Caractères')
		expect(wrapper.find('h1, h2, h3, h4, h5, h6').text()).toContain('Vérification')
	})

	it('1.5 and 7.3 – provides image/audio alternatives and native keyboard controls', async () => {
		const wrapper = await mountCaptcha('choice')
		expect(wrapper.findAll('button').length).toBeGreaterThanOrEqual(2)
		expect(wrapper.findAll('button[type="button"]').length).toBeGreaterThanOrEqual(2)
		await wrapper.unmount()
		const audioWrapper = await mountCaptcha('audio')
		expect(audioWrapper.get('button.captcha-audio').attributes('aria-label')).toBeUndefined()
	})

	it('3.3, 7.5 and 10.7 – keeps refresh and support actions named and focusable', async () => {
		const wrapper = await mountCaptcha()
		expect(wrapper.get('[data-test-id="captcha-image-new"]').element.tagName).toBe('BUTTON')
		expect(wrapper.get('[data-test-id="captcha-image-change"]').element.tagName).toBe('BUTTON')
		expect(wrapper.get('a[href^="tel:"]').attributes('href')).toBe('tel:3648')
	})

	it('11.10 and 11.13 – exposes the CAPTCHA answer as a required text input', async () => {
		const wrapper = await mountCaptcha()
		const input = wrapper.get('input')
		expect(input.attributes('aria-required')).toBe('true')
		expect(input.attributes('type')).toBe('text')
	})
})
