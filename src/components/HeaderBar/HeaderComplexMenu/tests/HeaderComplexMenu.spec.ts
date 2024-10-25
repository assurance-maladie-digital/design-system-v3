import { describe, it, expect } from 'vitest'

import HeaderComplexMenu from '../HeaderComplexMenu.vue'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

describe('HeaderComplexMenu', () => {
	const BtnTestComponent = {
		setup() {
			const props = defineProps({ modelValue: Boolean })
			return { open: props.modelValue }
		},
		template: `<button @click="$emit('update:modelValue', !open)">Test</button>`,
	}

	it('should render the component', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
			inject: {
				registerHeaderMenu: () => {},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()

		const menu = wrapper.find('.menu')
		expect(menu.attributes('style')).toContain('display: none;')

		const btn = wrapper.find('.header-menu-btn')
		await btn.trigger('click')
		expect(menu.attributes('style')).toBeUndefined()
	})

	it('should close the menu when clicking outside', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
			},
			inject: {
				registerHeaderMenu: () => {},
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
			slots: {
				default: '<div>Default slot</div>',
			},
		})

		const menu = wrapper.find('.menu')
		const btn = wrapper.find('.header-menu-btn')
		await btn.trigger('click')
		expect(menu.attributes('style')).toBeUndefined()

		await wrapper.find('.overlay').trigger('click')

		expect(menu.attributes('style')).toContain('display: none;')
	})

	it('should not close the menu when clicking inside', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
			},
			inject: {
				registerHeaderMenu: () => {},
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
			slots: {
				default: '<div>Default slot</div>',
			},
		})

		const menu = wrapper.find('.menu')
		const btn = wrapper.find('button')
		await btn.trigger('click')
		expect(menu.attributes('style')).toBeUndefined()

		await wrapper.find('.header-menu').trigger('click')
		expect(menu.attributes('style')).toBeUndefined()
	})

	it('should listen to the button to open and close the menu', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
			},
			inject: {
				registerHeaderMenu: () => {},
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
			slots: {
				default: '<div>Default slot</div>',
			},
		})

		const menu = wrapper.find('.menu')
		const btn = wrapper.find('button')
		await btn.trigger('click')
		expect(menu.attributes('style')).toBeUndefined()

		await btn.trigger('click')
		expect(menu.attributes('style')).toContain('display: none;')
	})
})
