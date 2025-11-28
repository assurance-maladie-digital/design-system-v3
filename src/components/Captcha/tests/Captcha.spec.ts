import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import Captcha from '../Captcha.vue'
import { vuetify } from '@tests/unit/setup'

describe('Captcha', () => {
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
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await new Promise(resolve => setTimeout(resolve, 50))

		expect(wrapper.find('.captcha-helpdesk').exists()).toBe(false)
	})
})
