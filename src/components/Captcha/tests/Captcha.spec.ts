import { describe, it, expect, vi, afterEach } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import Captcha from '../Captcha.vue'
import type { ComponentPublicInstance } from 'vue/dist/vue.js'

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
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
			},
		})

		// Wait for the component to fully mount and initialize

		// Allow additional time for async initialization
		await flushPromises()

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
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				type: 'audio',
			},
		})

		// Wait for the component to fully mount and initialize

		// Allow additional time for async initialization
		await flushPromises()

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
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
			},
		})

		// Simulate text input change
		await (wrapper.vm as ComponentPublicInstance<typeof Captcha>).emitChangeValueEvent('new-text-value')

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
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
			},
		})

		await flushPromises()

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

		const wrapper = mount<typeof Captcha>(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				modelValue: 'initial-value',
			},
		})

		await wrapper.vm.$nextTick()

		// Change modelValue prop
		await (wrapper as VueWrapper<ComponentPublicInstance<typeof Captcha>>).setProps({ modelValue: 'updated-value' })
		await wrapper.vm.$nextTick()

		expect((wrapper.vm as ComponentPublicInstance<typeof Captcha>).text).toBe('updated-value')
	})

	it('handles helpDesk prop correctly', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				helpDesk: '1234',
			},
		})

		await flushPromises()

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
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				helpDesk: false,
			},
		})

		await flushPromises()

		expect(wrapper.find('.captcha-helpdesk').exists()).toBe(false)
	})

	it('displays required validation error on blur when captcha text is empty', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				required: true,
				modelValue: '',
			},
		})

		await flushPromises()

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)

		await input.trigger('focus')
		await input.trigger('blur')

		expect(wrapper.text()).toContain('est requis')
	})

	it('applies customRules and displays custom error message on blur', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				modelValue: 'abc',
				customRules: [{
					type: 'custom',
					options: {
						validate: () => false,
						message: 'Erreur custom captcha',
					},
				}],
			},
		})

		await flushPromises()

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)

		await input.trigger('focus')
		await input.trigger('blur')

		expect(wrapper.text()).toContain('Erreur custom captcha')
	})

	it('applies customWarningRules and displays custom warning message on blur', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				modelValue: 'abc',
				customWarningRules: [{
					type: 'custom',
					options: {
						validate: () => false,
						isWarning: true,
						warningMessage: 'Warning custom captcha',
					},
				}],
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)

		await input.trigger('focus')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('Warning custom captcha')
	})

	it('applies customSuccessRules and displays custom success message on blur', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				modelValue: 'abc',
				showSuccessMessages: true,
				customSuccessRules: [{
					type: 'custom',
					options: {
						validate: () => true,
						successMessage: 'Succès custom captcha',
					},
				}],
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)

		await input.trigger('focus')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('Succès custom captcha')
	})

	it('resets the validation when the exposed clearValidation method is called', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))

		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				required: true,
				modelValue: '',
			},
		})

		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await flushPromises()

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)

		await input.trigger('focus')
		await input.trigger('blur')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('est requis')

		// Call the exposed clearValidation method
		await (wrapper.vm as ComponentPublicInstance<typeof Captcha>).clearValidation()

		expect(wrapper.text()).not.toContain('est requis')
	})

	it('resets the field and the validation when the the exposed reset method is called', async () => {
		const response = {
			ok: true,
			json: async () => ({ id: 'captcha-id' }),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} as any
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response))
		const wrapper = mount(Captcha, {
			props: {
				urlCreate: '/captcha/captcha.json',
				urlGetImage: '/captcha/captcha.png',
				urlGetAudio: '/captcha/captcha.mp3',
				required: true,
				modelValue: '',
				customRules: [{
					type: 'custom',
					options: {
						validate: () => false,
						message: 'Erreur custom captcha',
					},
				}],
			},
		})

		await flushPromises()

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)

		await input.trigger('focus')
		await input.setValue('abc')
		await input.trigger('blur')

		expect(wrapper.text()).toContain('Erreur custom captcha')

		await (wrapper.vm as ComponentPublicInstance<typeof Captcha>).reset()

		expect(wrapper.text()).not.toContain('Erreur custom captcha')
		expect(input.element.value).toBe('')
	})
})
