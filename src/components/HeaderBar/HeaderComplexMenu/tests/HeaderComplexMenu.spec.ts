import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import HeaderComplexMenu from '../HeaderComplexMenu.vue'
import { afterEach } from 'node:test'

describe('HeaderComplexMenu', () => {
	const BtnTestComponent = {
		setup() {
			const props = defineProps({ modelValue: Boolean })
			return { open: props.modelValue }
		},
		template: `<button @click="$emit('update:modelValue', !open)">Test</button>`,
	}

	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('should render the component', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
				provide: {
					registerHeaderMenu: () => {},
				},
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()

		const menu = wrapper.find('.overlay')
		expect(menu.attributes('style')).toContain('display: none;')

		const btn = wrapper.find('.header-menu-btn')
		await btn.trigger('click')
		expect(menu.attributes('style')).toBeUndefined()
	})

	it('should close the menu when clicking outside', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
				provide: {
					registerHeaderMenu: () => {},
				},
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			attachTo: document.body,
		})

		const overlay = wrapper.find('.overlay')
		const btn = wrapper.find('.header-menu-btn')

		await btn.trigger('click')
		expect(overlay.attributes('style')).toBeUndefined()

		await overlay.trigger('click')
		expect(overlay.attributes('style')).toContain('display: none;')

		wrapper.unmount()
	})

	it('should not close the menu when clicking inside', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
				provide: {
					registerHeaderMenu: () => {},
				},
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
			slots: {
				default: '<div>Default slot</div>',
			},
			attachTo: document.body,
		})

		const menu = wrapper.find('.overlay')
		const btn = wrapper.find('button')
		await btn.trigger('click')
		expect(menu.attributes('style')).toBeUndefined()

		await wrapper.find('.header-menu').trigger('click')
		expect(menu.attributes('style')).toBeUndefined()

		wrapper.unmount()
	})

	it('should listen to the button to open and close the menu', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
				provide: {
					registerHeaderMenu: () => {},
				},
			},
			stubs: {
				HeaderMenuBtn: BtnTestComponent,
			},
			slots: {
				default: '<div>Default slot</div>',
			},
		})

		const menu = wrapper.find('.overlay')
		const btn = wrapper.find('button')
		await btn.trigger('click')
		expect(menu.attributes('style')).toBeUndefined()

		await btn.trigger('click')
		expect(menu.attributes('style')).toContain('display: none;')
	})
})
