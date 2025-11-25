import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, afterAll } from 'vitest'
import { registerHeaderMenuKey } from '../../consts'
import HeaderBurgerMenu from '../HeaderBurgerMenu.vue'
import { defineComponent, toRef } from 'vue'

describe('HeaderBurgerMenu', () => {
	const BtnTestComponent = defineComponent({
		props: {
			modelValue: {
				type: Boolean,
				default: false,
			},
		},
		setup(props) {
			return { open: toRef(props, 'modelValue'), focus: () => {} }
		},
		template: `<button @click="$emit('update:modelValue', !open)">Test</button>`,
	})

	vi.mock('@/utils/functions/throttleDisplayFn/throttleDisplayFn.ts', () => ({
		default: (fn: (...args: unknown[]) => void) => fn,
	}))

	afterAll(() => {
		vi.restoreAllMocks()
		document.body.innerHTML = ''
	})

	it('should render the component', async () => {
		const wrapper = mount(HeaderBurgerMenu, {
			global: {
				provide: {
					[registerHeaderMenuKey]: () => {},
				},
				stubs: {
					teleport: true,
					HeaderMenuBtn: BtnTestComponent,
				},
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			attachTo: document.body,
		})

		expect(wrapper.find('.overlay').exists()).toBe(false)
		const btn = wrapper.find('button')
		await btn.trigger('click')
		expect(wrapper.find('.overlay').exists()).toBe(true)
		expect(wrapper.find('.overlay').html()).toMatchSnapshot()

		wrapper.unmount()
	})

	it('should close the menu when clicking outside', async () => {
		const wrapper = mount(HeaderBurgerMenu, {
			global: {
				provide: {
					[registerHeaderMenuKey]: () => {},
				},
				stubs: {
					teleport: true,
					HeaderMenuBtn: BtnTestComponent,
				},
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			attachTo: document.body,
		})

		const btn = wrapper.find('button')

		await btn.trigger('click')
		expect(wrapper.find('.overlay').exists()).toBe(true)

		await wrapper.find('.overlay').trigger('click')
		expect(wrapper.find('.overlay').exists()).toBe(false)

		wrapper.unmount()
	})

	it('should not close the menu when clicking inside', async () => {
		const wrapper = mount(HeaderBurgerMenu, {
			global: {
				provide: {
					[registerHeaderMenuKey]: () => {},
				},
				stubs: {
					teleport: true,
					HeaderMenuBtn: BtnTestComponent,
				},
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			attachTo: document.body,
		})

		const btn = wrapper.find('button')
		await btn.trigger('click')
		expect(wrapper.find('.overlay').exists()).toBe(true)

		await wrapper.find('.header-menu').trigger('click')
		expect(wrapper.find('.overlay').exists()).toBe(true)

		wrapper.unmount()
	})

	it('should listen to the button to open and close the menu', async () => {
		const wrapper = mount(HeaderBurgerMenu, {
			global: {
				provide: {
					[registerHeaderMenuKey]: () => {},
				},
				stubs: {
					Teleport: true,
					HeaderMenuBtn: BtnTestComponent,
				},
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			attachTo: document.body,
		})

		const btn = wrapper.find('button')
		await btn.trigger('click')
		expect(wrapper.find('.overlay').exists()).toBe(true)

		await btn.trigger('click')
		expect(wrapper.find('.overlay').exists()).toBe(false)

		wrapper.unmount()
	})

	it('reposition the menu when the size of the window changes', async () => {
		const wrapper = mount(HeaderBurgerMenu, {
			global: {
				provide: {
					[registerHeaderMenuKey]: () => {},
				},
				stubs: {
					Teleport: true,
					HeaderMenuBtn: BtnTestComponent,
				},
			},
			attachTo: document.body,
		})

		const btn = wrapper.find('button')
		await btn.trigger('click')
		const menuBtnWrapper = wrapper.find('.menu>nav')

		vi.spyOn(menuBtnWrapper.element, 'getBoundingClientRect').mockReturnValue(new DOMRect(50, 50, 0, 0))

		window.dispatchEvent(new Event('resize'))
		await wrapper.vm.$nextTick()

		let renderStyle = wrapper.find('.menu-wrapper').attributes('style')
		expect(renderStyle).toContain('left: 50px; top: 50px;')

		vi.spyOn(menuBtnWrapper.element, 'getBoundingClientRect').mockReturnValue(new DOMRect(40, 60, 0, 0))

		window.dispatchEvent(new Event('resize'))
		await wrapper.vm.$nextTick()

		renderStyle = wrapper.find('.menu-wrapper').attributes('style')
		expect(renderStyle).toContain('left: 40px; top: 60px;')

		wrapper.unmount()
	})
})
