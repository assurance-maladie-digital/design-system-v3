import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { vuetify } from '@tests/unit/setup'

import DataListLoading from '../DataListLoading.vue'

describe('DataListLoading', () => {
	it('renders correctly', () => {
		const wrapper = mount(DataListLoading, {
			global: {
				plugins: [vuetify],
			},
			props: {
				heading: true,
				itemsNumber: 3,
				row: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
