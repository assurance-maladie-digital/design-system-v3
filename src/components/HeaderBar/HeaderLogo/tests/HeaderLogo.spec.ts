import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HeaderLogo from '../HeaderLogo.vue'

describe('HeaderLogo', () => {
	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('should render the component in mobile mode and desktop', async () => {
		// Test mobile mode
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const mobileWrapper = mount(HeaderLogo, {
			attachTo: document.body,
		})

		// Wait for reactive updates
		await mobileWrapper.vm.$nextTick()
		const mobileMode = mobileWrapper.html()

		// Verify mobile mode renders LogoMobile (width="141" height="42")
		expect(mobileMode).toContain('width="141"')
		expect(mobileMode).toContain('height="42"')
		mobileWrapper.unmount()

		// Test desktop mode
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)

		const desktopWrapper = mount(HeaderLogo, {
			attachTo: document.body,
		})

		// Wait for reactive updates
		await desktopWrapper.vm.$nextTick()
		const desktopMode = desktopWrapper.html()

		// Verify desktop mode renders Logo (width="211" height="63")
		expect(desktopMode).toContain('width="211"')
		expect(desktopMode).toContain('height="63"')
		// And doesn't contain mobile dimensions
		expect(desktopMode).not.toContain('width="141"')
		desktopWrapper.unmount()

		// Ensure they are different
		expect(mobileMode).not.toEqual(desktopMode)
	})

	it('sould display the service and the logo aria-label', async () => {
		const wrapper = mount(HeaderLogo, {
			props: {
				ariaLabel: 'Test aria label',
				serviceTitle: 'Test service title',
				serviceSubtitle: 'Test service subtitle',
			},
		})

		const render = wrapper.html()

		expect(render).toContain('Test service title')
		expect(render).toContain('Test service subtitle')
		expect(render).toContain('Test aria label')
	})

	it('should render only the serviceTitle slot when set', async () => {
		const wrapper = mount(HeaderLogo, {
			props: {
				serviceTitle: 'Test service title',
			},
			slots: {
				'brand-content': '<h1>other title</h1>',
			},
		})

		const render = wrapper.html()

		expect(render).toContain('other title')
		expect(render).not.toContain('Test service title')
	})

	it('render a router-link when homeLink is set with `to`', async () => {
		const wrapper = mount(HeaderLogo, {
			global: {
				stubs: ['RouterLink'] },
			props: {
				homeLink: {
					to: '/',
				},
			},
		})

		expect(wrapper.find('router-link-stub').exists()).toBe(true)
		expect(wrapper.find('router-link-stub').attributes('to')).toBe('/')
	})

	it('render a div when there there is no `RouterLink` component registered', async () => {
		const wrapper = mount(HeaderLogo, {
			props: {
				homeLink: {
					to: '/',
				},
			},
		})

		expect(wrapper.find('.logo').element.tagName).toBe('DIV')
	})

	it('render a div when the homeLink properties `to` and `href` are both set to `undefined`', async () => {
		const wrapper = mount(HeaderLogo, {
			props: {
				homeLink: {
					to: undefined,
					href: undefined,
				},
			},
		})

		expect(wrapper.find('.logo').element.tagName).toBe('DIV')
	})
})
