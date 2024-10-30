import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import HeaderLoading from '../HeaderLoading.vue'

describe('HeaderLoading', () => {
	it('renders correctly', () => {
		const wrapper = mount(HeaderLoading, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				width: '100px',
				height: '1rem',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
