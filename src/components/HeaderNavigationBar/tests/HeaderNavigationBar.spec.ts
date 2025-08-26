import HeaderBurgerMenu from '@/components/HeaderBar/HeaderBurgerMenu/HeaderBurgerMenu.vue'
import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { afterAll, describe, expect, it, vi } from 'vitest'
import HeaderNavbar from '../HeaderNavigationBar.vue'
import HorizontalNavbar from '../HorizontalNavbar/HorizontalNavbar.vue'

describe('HeaderNavigationBar', () => {
	vi.mock('@/utils/functions/throttleDisplayFn/throttleDisplayFn.ts', () => ({
		default: (fn: (...args: unknown[]) => void) => fn,
	}))

	afterAll(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	it('should render the component', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.window.happyDOM.setInnerWidth(1200)

		const wrapper = mount(HeaderNavbar, {
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
					RouterLink: true, // Stub pour éviter l'avertissement de résolution de composant
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
		// le vtabs generait des btn dans lesquels le text etait en majuscule ici cela se via le code de SyTabs (toUpperCase() sur les items)
		expect(wrapper.html()).toContain('HOME')
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
					RouterLink: true, // Stub pour éviter l'avertissement de résolution de composant
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

	it('should toggle the burger menu', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.window.happyDOM.setInnerWidth(600)

		const wrapper = mount(HeaderNavbar, {
			global: {
				plugins: [vuetify],
				stubs: {
					Teleport: true,
					RouterLink: true,
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

		const btn = wrapper.find('.header-menu-btn')
		await btn.trigger('click')
		expect(wrapper.find('.header-menu').exists()).toBe(true)
		await btn.trigger('click')
		expect(wrapper.find('.header-menu').exists()).toBe(false)
	})
})
