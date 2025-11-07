import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import DataListLoading from '../DataListLoading.vue'

describe('DataListLoading', () => {
	it('renders correctly', () => {
		const wrapper = mount(DataListLoading, {
			props: {
				heading: true,
				itemsNumber: 3,
				row: true,
			},
		})

		const elExists = wrapper.find('.sy-data-list-loading-item').exists()
		expect(elExists).toBe(true)
	})
})
