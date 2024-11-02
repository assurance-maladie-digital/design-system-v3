import { vuetify } from '@tests/unit/setup'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { registerHeaderMenuKey } from '../../consts'
import HeaderComplexMenu from '../HeaderComplexMenu.vue'
import { defineComponent, toRef } from 'vue'

describe('HeaderComplexMenu', () => {
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

	afterEach(() => {
		vi.resetAllMocks()
		document.body.innerHTML = ''
	})

	it('should render the component', async () => {
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
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
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
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
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
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
		const wrapper = mount(HeaderComplexMenu, {
			global: {
				plugins: [vuetify],
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
})
