import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HeaderLogo from '../HeaderLogo.vue'

describe('HeaderLogo', () => {
	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('should render native picture sources for mobile and desktop logos', async () => {
		// Test mobile mode
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)

		const mobileWrapper = mount(HeaderLogo, {
			attachTo: document.body,
		})

		await mobileWrapper.vm.$nextTick()
		const mobileMode = mobileWrapper.html()

		// Verify picture fallback img exists for mobile
		expect(mobileMode).toContain('<picture')
		expect(mobileMode).toContain('logo-mobile.svg')
		mobileWrapper.unmount()

		// Test desktop mode
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)

		const desktopWrapper = mount(HeaderLogo, {
			attachTo: document.body,
		})

		await desktopWrapper.vm.$nextTick()
		const desktopMode = desktopWrapper.html()

		// Verify desktop source is present in picture
		expect(desktopMode).toContain('logo-desktop.svg')
		expect(desktopMode).toContain('min-width: 990px')
		desktopWrapper.unmount()

		// Ensure source declarations are stable regardless of viewport
		expect(mobileMode).toContain('min-width: 990px')
	})

	it('sould display the service and the logo aria-label', async () => {
		const wrapper = mount(HeaderLogo, {
			props: {
				headingLevelTitle: 2,
				ariaLabel: 'Test aria label',
				serviceTitle: 'Test service title',
				serviceSubtitle: 'Test service subtitle',
			},
		})

		const render = wrapper.html()

		expect(render).toContain('Test service title')
		expect(render).toContain('Test service subtitle')
		expect(wrapper.find('img[alt="Test aria label"]').exists()).toBe(true)
	})

	it('should render only the serviceTitle slot when set', async () => {
		const wrapper = mount(HeaderLogo, {
			props: {
				headingLevelTitle: 2,
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
				headingLevelTitle: 2,
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
				headingLevelTitle: 2,
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
				headingLevelTitle: 2,
				homeLink: {
					to: undefined,
					href: undefined,
				},
			},
		})

		expect(wrapper.find('.logo').element.tagName).toBe('DIV')
	})

	it('should use browser-native source selection for desktop and mobile svg files', async () => {
		const wrapper = mount(HeaderLogo, {
			attachTo: document.body,
		})

		const source = wrapper.find('source')
		const image = wrapper.find('img')

		expect(source.exists()).toBe(true)
		expect(source.attributes('media')).toBe('(min-width: 990px)')
		expect(source.attributes('srcset')).toContain('logo-desktop.svg')
		expect(image.exists()).toBe(true)
		expect(image.attributes('src')).toContain('logo-mobile.svg')

		wrapper.unmount()
	})
})
