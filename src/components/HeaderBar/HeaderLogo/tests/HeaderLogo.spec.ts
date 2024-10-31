import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HeaderLogo from '../HeaderLogo.vue'

describe('HeaderLogo', () => {
	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('should render the component in mobile mode and desktop', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)
		const wrapper = mount(HeaderLogo, {
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})
		const mobilMode = wrapper.html()

		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(1200)
		await wrapper.vm.$nextTick()

		const desktopMode = wrapper.html()

		expect(mobilMode).not.toEqual(desktopMode)

		wrapper.unmount()
	})

	it('sould display the service and the logo aria-label', async () => {
		const wrapper = mount(HeaderLogo, {
			global: {
				plugins: [vuetify],
			},
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
			global: {
				plugins: [vuetify],
			},
			props: {
				serviceTitle: 'Test service title',
			},
			slots: {
				brandContent: '<h1>other title</h1>',
			},
		})

		const render = wrapper.html()

		expect(render).toContain('other title')
		expect(render).not.toContain('Test service title')
	})
})
