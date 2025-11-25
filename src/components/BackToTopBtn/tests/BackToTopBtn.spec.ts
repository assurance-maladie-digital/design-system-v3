import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import BackToTopBtn from '../BackToTopBtn.vue'

describe('BackToTopBtn', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	it('renders correctly', () => {
		const wrapper = mount(BackToTopBtn)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly when nudgeBottom and nudgeRight are set to invalid values', () => {
		const wrapper = mount(BackToTopBtn, {
			props: {
				nudgeBottom: '',
				nudgeRight: '',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('shows the button when the user scrolls down', async () => {
		// Initialize scroll position to 0
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)

		const wrapper = mount(BackToTopBtn, {
			attachTo: document.body,
		})

		// Wait for component to initialize
		await wrapper.vm.$nextTick()

		const buttonElement = wrapper.find('.vd-back-to-top-btn')
		// Button should be hidden initially (v-show="false")
		expect(buttonElement.exists()).toBe(true)
		expect((buttonElement.element as HTMLElement).style.display).toBe('none')

		// Simulate scroll down
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()

		// Button should now be visible
		expect((buttonElement.element as HTMLElement).style.display).not.toBe('none')
	})

	it('shows the button when the user scrolls down and the target is a custom element', async () => {
		const divContent = document.createElement('div')
		divContent.id = 'test-target'
		divContent.style.height = '1000px'
		divContent.style.overflow = 'auto'
		document.body.appendChild(divContent)

		// Initialize scroll position to 0
		vi.spyOn(divContent, 'scrollTop', 'get').mockReturnValue(0)

		const wrapper = mount(BackToTopBtn, {
			props: {
				target: 'test-target',
			},
			attachTo: document.body,
		})

		// Wait for component to initialize
		await wrapper.vm.$nextTick()

		const buttonElement = wrapper.find('.vd-back-to-top-btn')
		// Button should be hidden initially (v-show="false")
		expect(buttonElement.exists()).toBe(true)
		expect((buttonElement.element as HTMLElement).style.display).toBe('none')

		// Simulate scroll down
		vi.spyOn(divContent, 'scrollTop', 'get').mockReturnValue(500)
		divContent.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()

		// Button should now be visible
		expect((buttonElement.element as HTMLElement).style.display).not.toBe('none')

		document.body.removeChild(divContent)
	})

	it('do not show the button when the user scrolls up', async () => {
		// Initialize scroll position to 0
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)

		const wrapper = mount(BackToTopBtn, {
			attachTo: document.body,
		})

		// Wait for component to initialize
		await wrapper.vm.$nextTick()

		const buttonElement = wrapper.find('.vd-back-to-top-btn')
		// Button should be hidden initially (v-show="false")
		expect(buttonElement.exists()).toBe(true)
		expect((buttonElement.element as HTMLElement).style.display).toBe('none')

		// Simulate scroll down
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()

		// Button should now be visible
		expect((buttonElement.element as HTMLElement).style.display).not.toBe('none')

		// Scroll back up
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(50)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()

		// Button should be hidden again
		expect((buttonElement.element as HTMLElement).style.display).toBe('none')
	})

	it('scrolls to the top when the button is clicked', async () => {
		const wrapper = mount(BackToTopBtn)

		const scrollToSpy = vi
			.spyOn(window, 'scrollTo')
			.mockImplementation(() => {})

		await wrapper.find('.v-btn').trigger('click')

		expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
	})

	it('scrolls to the top when the button is clicked and the target is a custom element', async () => {
		const wrapper = mount(BackToTopBtn, {
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
		const wrapper = mount(BackToTopBtn)

		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

		wrapper.unmount()

		expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
	})
})
