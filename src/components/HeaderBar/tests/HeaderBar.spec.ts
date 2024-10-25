import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { afterEach } from 'node:test'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, inject, onMounted, ref, type Ref } from 'vue'
import HeaderBar from '../HeaderBar.vue'

describe('HeaderBar', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	it('should render the component', async () => {
		const wrapper = mount(HeaderBar, {
			props: {
				sticky: false,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})
		window.dispatchEvent(new CustomEvent('scroll', { detail: 0 }))

		expect(wrapper.html()).toMatchSnapshot()

		// mock scroll related values
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(2000)
		const header = wrapper.find('.header')
		vi.spyOn(header.element, 'getBoundingClientRect').mockReturnValue({
			top: -2000,
		} as DOMRect)
		window.dispatchEvent(new CustomEvent('scroll', { detail: 2000 }))

		await wrapper.vm.$nextTick()

		const stickyHeader = wrapper.find('.sticky-header')
		const stickyHeaderStyle = stickyHeader.attributes('style')
		expect(stickyHeaderStyle).toContain('position: relative;')
		expect(stickyHeaderStyle).toContain('top: auto;')

		wrapper.unmount()
	})

	it('should render all the component slots', async () => {
		const wrapper = mount(HeaderBar, {
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
			slots: {
				'default': '<div>Default slot</div>',
				'prepend': '<div>Prepend slot</div>',
				'append': '<div>Append slot</div>',
				'menu': '<div>Menu slot</div>',
				'logo': '<div>Logo slot</div>',
				'header-side': '<div>Header side slot</div>',
			},
		})

		const text = wrapper.text()

		expect(text).not.toContain('Default slot')
		expect(text).toContain('Prepend slot')
		expect(text).toContain('Append slot')
		expect(text).toContain('Menu slot')
		expect(text).toContain('Logo slot')
		expect(text).toContain('Header side slot')

		wrapper.unmount()
	})

	it('should render in sticky mode', async () => {
		const wrapper = mount(HeaderBar, {
			props: {
				sticky: true,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})
		window.dispatchEvent(new CustomEvent('scroll', { detail: 0 }))

		// mock scroll related values
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(2000)
		const header = wrapper.find('.header')
		vi.spyOn(header.element, 'getBoundingClientRect').mockReturnValue({
			top: -2000,
		} as DOMRect)
		window.dispatchEvent(new CustomEvent('scroll', { detail: 2000 }))

		await wrapper.vm.$nextTick()

		const stickyHeader = wrapper.find('.sticky-header')
		const stickyHeaderStyle = stickyHeader.attributes('style')
		expect(stickyHeaderStyle).toContain('position: fixed;')
		expect(stickyHeaderStyle).toContain('top: 0px;')

		wrapper.unmount()
	})

	it('should only show the header when the user scrolls up', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.happyDOM.setInnerWidth(600)
		console.log('should only show the header when the user scrolls up')
		const wrapper = mount(HeaderBar, {
			props: {
				hideWhenDown: true,
			},
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
		})
		window.dispatchEvent(new CustomEvent('scroll', { detail: 0 }))

		const header = wrapper.find('.header')

		// mock scroll related values
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(2000)

		vi.spyOn(header.element, 'getBoundingClientRect').mockReturnValue({
			top: -2000,
			height: 70,
		} as DOMRect)
		vi.spyOn(document.documentElement, 'scrollTop', 'get').mockReturnValue(2000)
		window.dispatchEvent(new CustomEvent('scroll', { detail: 2000 }))

		await wrapper.vm.$nextTick()

		const stickyHeader = wrapper.find('.sticky-header')
		let stickyHeaderStyle = stickyHeader.attributes('style')

		// Do not show the header when the user scrolls down
		expect(stickyHeaderStyle).toContain('position: fixed;')
		expect(stickyHeaderStyle).toContain('top: 0px;')
		expect(stickyHeaderStyle).toContain('transform: translateY(-100%);')

		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(800)
		vi.spyOn(header.element, 'getBoundingClientRect').mockReturnValue({
			top: -800,
			height: 70,
		} as DOMRect)
		vi.spyOn(document.documentElement, 'scrollTop', 'get').mockReturnValue(800)
		window.dispatchEvent(new CustomEvent('scroll', { detail: 800 }))

		await wrapper.vm.$nextTick()

		stickyHeaderStyle = stickyHeader.attributes('style')

		// Do show the header when the user scrolls up
		expect(stickyHeaderStyle).toContain('position: fixed;')
		expect(stickyHeaderStyle).toContain('top: 0px;')
		expect(stickyHeaderStyle).toContain('transform: none;')

		wrapper.unmount()
	})

	const testMenu = defineComponent({
		setup() {
			const menu = ref(false)
			const registerHeaderMenu = inject<(r: Ref<boolean>) => void>('registerHeaderMenu')

			onMounted(() => {
				if (registerHeaderMenu) {
					registerHeaderMenu(menu)
				}
			})

			return {
				menu,
			}
		},
		template: '<button @click="menu = true">Menu</button>',
	})

	it('should render the menu slot', async () => {
		const wrapper = mount({
			components: {
				HeaderBar,
				Menu: testMenu,
			},
			template: `
				<HeaderBar>
					<template #menu>
						<Menu />
					</template>
					<template #logo="{menuOpen}">
						<div>{{menuOpen ? 'the menu is open' : 'the menu is closed'}}</div>
					</template>
				</HeaderBar>`,
		}, {
			global: {
				plugins: [vuetify],
			},
			attachTo: document.body,
			slots: {
				menu: testMenu,
			},
		})
		const text = wrapper.text()
		expect(text).toContain('Menu')
		expect(text).toContain('the menu is closed')

		const button = wrapper.find('button')
		await button.trigger('click')

		expect(wrapper.text()).toContain('the menu is open')

		wrapper.unmount()
	})
})
