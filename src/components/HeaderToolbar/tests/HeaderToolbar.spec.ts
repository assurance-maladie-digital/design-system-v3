import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import HeaderToolbar from '../HeaderToolbar.vue'
import { vuetify } from '@tests/unit/setup'

describe('HeaderToolbar.vue', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(HeaderToolbar, {
			global: {
				plugins: [vuetify],
			},
			props: {
				leftMenu: [
					{
						text: 'Left',
						to: '/',
						ariaLabel: 'Left',
					},
				],
				rightMenu: [
					{
						text: 'Right',
						to: '/',
						ariaLabel: 'Right',
					},
				],
			},
		})
		expect(wrapper.exists()).toBe(true)
		expect(wrapper.find('#left-menu').text()).toBe('Left')
		expect(wrapper.find('#right-menu').text()).toBe('Right')
	})
})
