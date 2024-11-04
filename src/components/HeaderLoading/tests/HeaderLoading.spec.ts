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
			props: {
				width: '100px',
				height: '1rem',
			},
		})

		const elExists = wrapper.find('.vd-header-loading').exists()
		expect(elExists).toBe(true)
	})
})
