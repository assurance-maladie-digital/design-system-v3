import HeaderBurgerMenu from '@/components/HeaderBar/HeaderBurgerMenu/HeaderBurgerMenu.vue'
import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HeaderNavbar from '../HeaderNavbar.vue'
import HorizontalNavbar from '../HorizontalNavbar/HorizontalNavbar.vue'

describe('HeaderNavbar', () => {
	afterEach(() => {
		document.body.innerHTML = ''
		vi.restoreAllMocks()
	})

	it('should render the component', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.window.happyDOM.setInnerWidth(1200)

		const wrapper = mount(HeaderNavbar, {
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
				},
			},
			props: {
				items: [
					{
						label: 'Home',
						to: '/',
					},
					{
						label: 'About',
						to: '/about',
					},
				],
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.html()).toContain('Home')
		expect(wrapper.findComponent(HeaderBurgerMenu).exists()).toBe(false)
		expect(wrapper.findComponent(HorizontalNavbar).exists()).toBe(true)

		await wrapper.setProps({
			maxHorizontalMenuItems: 1,
		})

		expect(wrapper.findComponent(HeaderBurgerMenu).exists()).toBe(true)
		expect(wrapper.findComponent(HorizontalNavbar).exists()).toBe(false)

		wrapper.unmount()
	})

	it('transform the menu on resize', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.window.happyDOM.setInnerWidth(600)

		const wrapper = mount(HeaderNavbar, {
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
				},
			},
			props: {
				items: [
					{
						label: 'Home',
						to: '/',
					},
					{
						label: 'About',
						to: '/about',
					},
				],
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(HeaderBurgerMenu).exists()).toBe(true)
		expect(wrapper.findComponent(HorizontalNavbar).exists()).toBe(false)

		wrapper.unmount()
	})
})
