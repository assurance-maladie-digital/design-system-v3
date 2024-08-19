import { vuetify } from '@tests/unit/setup'
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TestComponent from '../TestComponent.vue'

describe('TestComponent', () => {
	it('render correctly', () => {
		const wrapper = mount(TestComponent, {
			props: {
				number1: 5,
				number2: 2,
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.text()).toContain('7')
	})
})
