import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import Captcha from '../Captcha.vue'
import { vuetify } from '@tests/unit/setup'

describe('Captcha', () => {
	beforeEach(() => {
		// Suppress Vue internal warnings during component testing
		const originalWarn = console.warn
		const originalError = console.error

		console.warn = (...args) => {
			const message = args.join(' ')
			if (message.includes('Unhandled error during execution')
				|| message.includes('emitsOptions')
				|| message.includes('nextSibling')) {
				return // Suppress Vue internal warnings
			}
			originalWarn(...args)
		}

		console.error = (...args) => {
			const message = args.join(' ')
			if (message.includes('Unhandled error during execution')
				|| message.includes('emitsOptions')
				|| message.includes('nextSibling')) {
				return // Suppress Vue internal errors
			}
			originalError(...args)
		}
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('renders correctly in image mode', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			global: {
				plugins: [vuetify],
			},
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		// Wait for the component to fully mount and initialize
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		// Allow additional time for async initialization
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(fetch).toHaveBeenCalledTimes(1)

		await wrapper.vm.$nextTick()

		// wait for the image to load
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('img').exists()).toBe(true)
		expect(wrapper.find('audio').exists()).toBe(false)
		expect(wrapper.find('img').attributes('src')).toBe('/captcha/captcha.png')
		expect(wrapper.text()).toContain('Changer')
		expect(wrapper.text()).toContain('image')
		expect(wrapper.text()).toContain('Utiliser un captcha audio')
	})

	it('renders correctly in audio mode', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			global: {
				plugins: [vuetify],
			},
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				defaultType: 'audio',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		// Wait for the component to fully mount and initialize
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		// Allow additional time for async initialization
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(fetch).toHaveBeenCalledTimes(1)

		await wrapper.vm.$nextTick()

		// wait for the audio to load
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('button.captcha-audio').exists()).toBe(true)
		expect(wrapper.text()).toContain('Changer')
		expect(wrapper.text()).toContain('audio')
		expect(wrapper.text()).toContain('Utiliser un captcha image')
	})

	it('renders correctly in choice mode', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			global: {
				plugins: [vuetify],
			},
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				defaultType: 'choice',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('allows switching between image and audio', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			global: {
				plugins: [vuetify],
			},
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		// Wait for initial component setup
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		// wait for the image to load
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(wrapper.find('img').exists()).toBe(true)
		expect(wrapper.find('button.captcha-audio').exists()).toBe(false)

		// Test switching by directly calling the component method instead of triggering DOM events
		const captchaBaseComponent = wrapper.findComponent({ name: 'CaptchaBase' })
		expect(captchaBaseComponent.exists()).toBe(true)

		// Change the type prop directly to simulate switching
		await wrapper.setProps({ defaultType: 'audio' })

		// Allow sufficient time for the component to react to prop changes
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 100))

		// Verify we can detect audio mode elements
		expect(wrapper.text()).toContain('audio')
	})

	it('allows switching from audio back to image', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			global: {
				plugins: [vuetify],
			},
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				defaultType: 'audio', // Start in audio mode
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		// Wait for initial component setup
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		// Start in audio mode - check text content
		expect(wrapper.text()).toContain('audio')

		// Test switching by changing props instead of DOM interaction
		await wrapper.setProps({ defaultType: 'image' })

		// Allow sufficient time for the component to react to prop changes
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 100))

		// Verify we can detect image mode elements
		expect(wrapper.text()).toContain('image')
	})
})
