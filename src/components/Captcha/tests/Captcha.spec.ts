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
				type: 'audio',
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
				type: 'choice',
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
				type: 'choice',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		await wrapper.vm.$nextTick()

		// Find and click image button
		const imageBtn = wrapper.find('[data-test-id="captcha-image-btn"]')
		if (imageBtn.exists()) {
			await imageBtn.trigger('click')
			await wrapper.vm.$nextTick()
			expect(wrapper.emitted('update:type')?.[0]).toEqual(['image'])
		}

		// Find and click audio button
		const audioBtn = wrapper.find('[data-test-id="captcha-audio-btn"]')
		if (audioBtn.exists()) {
			await audioBtn.trigger('click')
			await wrapper.vm.$nextTick()
			expect(wrapper.emitted('update:type')).toBeTruthy()
		}
	})

	it('handles form submission successfully', async () => {
		const mockService = vi.fn().mockResolvedValue({ data: 'success' })
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
				service: mockService,
				modelValue: 'test-value',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		// Wait for captcha initialization
		await new Promise(resolve => setTimeout(resolve, 100))

		// Manually set the text value to simulate user input
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).emitChangeValueEvent('test-value')
		await wrapper.vm.$nextTick()

		// Call submitForm directly
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).submitForm()

		expect(mockService).toHaveBeenCalledWith('captcha-id', 'test-value')
		expect(wrapper.emitted('validation:click')).toBeTruthy()
		expect(wrapper.emitted('validation:success')).toBeTruthy()
	})

	it('handles form submission error', async () => {
		const error = { response: { data: { message: 'Invalid captcha' } } }
		const mockService = vi.fn().mockRejectedValue(error)
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
				service: mockService,
				modelValue: 'wrong-value',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		// Wait for captcha initialization
		await new Promise(resolve => setTimeout(resolve, 100))

		// Manually set the text value to simulate user input
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).emitChangeValueEvent('wrong-value')
		await wrapper.vm.$nextTick()

		// Call submitForm directly
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).submitForm()

		expect(mockService).toHaveBeenCalledWith('captcha-id', 'wrong-value')
		expect(wrapper.emitted('validation:error')).toBeTruthy()
		expect(wrapper.text()).toContain('Invalid captcha')
	})

	it('updates model value when text changes', async () => {
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

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		// Simulate text input change
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).emitChangeValueEvent('new-text-value')

		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new-text-value'])
	})

	it('emits validation:click event on form submission', async () => {
		const mockService = vi.fn().mockResolvedValue({ data: 'success' })
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
				service: mockService,
				modelValue: 'test-value',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		// Wait for captcha initialization
		await new Promise(resolve => setTimeout(resolve, 100))

		// Manually set the text value to simulate user input
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).emitChangeValueEvent('test-value')
		await wrapper.vm.$nextTick()

		// Call submitForm directly
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).submitForm()

		const validationEvent = wrapper.emitted('validation:click')?.[0]?.[0]
		expect(validationEvent).toEqual({
			captchaId: 'captcha-id',
			captchaValue: 'test-value',
		})
	})

	it('handles state changes during form submission', async () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let resolveService: (value: any) => void
		const servicePromise = new Promise((resolve) => {
			resolveService = resolve
		})
		const mockService = vi.fn().mockReturnValue(servicePromise)

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
				service: mockService,
				modelValue: 'test-value',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		// Start form submission
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const submitPromise = (wrapper.vm as any).submitForm()

		// Check pending state
		await wrapper.vm.$nextTick()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).state).toBe('pending')

		// Resolve the service promise
		resolveService!({ data: 'success' })
		await submitPromise

		// Check resolved state
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).state).toBe('resolved')
	})

	it('displays error messages correctly', async () => {
		const error = { response: { data: { message: 'Custom error message' } } }
		const mockService = vi.fn().mockRejectedValue(error)
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
				service: mockService,
				modelValue: 'test-value',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		// Submit form to trigger error
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).submitForm()
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('Custom error message')
		expect(wrapper.find('.v-alert').exists()).toBe(true)
	})

	it('handles unknown error gracefully', async () => {
		const error = { response: undefined }
		const mockService = vi.fn().mockRejectedValue(error)
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
				service: mockService,
				modelValue: 'test-value',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		// Submit form to trigger error
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (wrapper.vm as any).submitForm()
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('Erreur inconnue')
	})

	it('initializes captcha correctly on mount', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'test-captcha-id' }),
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

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(fetch).toHaveBeenCalledWith('/captcha/captcha.json', expect.any(Object))
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).id).toBe('test-captcha-id')
	})

	it('watches modelValue prop changes', async () => {
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
				modelValue: 'initial-value',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		await wrapper.vm.$nextTick()

		// Change modelValue prop
		await wrapper.setProps({ modelValue: 'updated-value' })
		await wrapper.vm.$nextTick()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((wrapper.vm as any).text).toBe('updated-value')
	})

	it('handles helpDesk prop correctly', async () => {
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
				helpDesk: '1234',
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(wrapper.text()).toContain('1234')
	})

	it('handles disabled helpDesk correctly', async () => {
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
				helpDesk: false,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				service: (_id, _value): any => {},
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(wrapper.find('.captcha-helpdesk').exists()).toBe(false)
	})
})
