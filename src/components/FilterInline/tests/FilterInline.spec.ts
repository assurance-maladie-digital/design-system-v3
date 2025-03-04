import { describe, it, expect } from 'vitest'
import FilterInline from '../FilterInline.vue'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

describe('FilterInline', () => {
	it('should render correctly', () => {
		const wrapper = mount(FilterInline, {
			props: {},
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.html()).toMatchSnapshot()
	})
})
