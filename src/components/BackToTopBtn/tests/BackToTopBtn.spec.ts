import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import BackToTopBtn from '../'
import { vuetify } from '@tests/unit/setup'

describe('BackToTopBtn', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	it('renders correctly', () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly when nudgeBottom and nudgeRight are set to invalid values', () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				nudgeBottom: '',
				nudgeRight: '',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('shows the button when the user scrolls down', async () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const buttonElement = wrapper.find('.vd-back-to-top-btn')
		expect(buttonElement.isVisible()).toBeFalsy()

		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()

		expect(buttonElement.isVisible()).toBeTruthy()
	})

	it('shows the button when the user scrolls down and the target is a custom element', async () => {
		document.body.innerHTML = '<div id="test"></div>'
		const divContent = document.getElementById('test') as HTMLDivElement

		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
			attachTo: divContent,
			props: {
				target: 'test',
			},
		})

		const buttonElement = wrapper.find('.vd-back-to-top-btn')
		expect(buttonElement.isVisible()).toBeFalsy()

		vi.spyOn(divContent, 'scrollTop', 'get').mockReturnValue(500)
		divContent.dispatchEvent(new CustomEvent('scroll'))

		await wrapper.vm.$nextTick()
		expect(buttonElement.isVisible()).toBeTruthy()
	})

	it('do not show the button when the user scrolls up', async () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})

		const buttonElement = wrapper.find('.vd-back-to-top-btn')
		expect(buttonElement.isVisible()).toBeFalsy()

		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()
		expect(buttonElement.isVisible()).toBeTruthy()

		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()

		expect(buttonElement.isVisible()).toBeFalsy()
	})

	it('scrolls to the top when the button is clicked', async () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
		})

		const scrollToSpy = vi
			.spyOn(window, 'scrollTo')
			.mockImplementation(() => {})

		await wrapper.find('.v-btn').trigger('click')

		expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
	})

	it('scrolls to the top when the button is clicked and the target is a custom element', async () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				target: 'test',
			},
		})

		const scrollToSpy = vi.fn()

		vi.spyOn(document, 'getElementById').mockReturnValue({
			scrollTo: scrollToSpy,
		} as unknown as HTMLElement)

		await wrapper.find('.v-btn').trigger('click')

		expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
	})

	it('scrolls to the top when the button is clicked and the target is a custom element that does not exist', async () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				target: 'test',
			},
		})

		const scrollToSpy = vi
			.spyOn(window, 'scrollTo')
			.mockImplementation(() => {})

		vi.spyOn(document, 'getElementById').mockReturnValue(null)

		await wrapper.find('.v-btn').trigger('click')

		expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
	})

	it('remove the scroll event listener when the component is destroyed', async () => {
		const wrapper = mount(BackToTopBtn, {
			global: {
				plugins: [vuetify],
			},
		})

		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

		wrapper.unmount()

		expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
	})
})
