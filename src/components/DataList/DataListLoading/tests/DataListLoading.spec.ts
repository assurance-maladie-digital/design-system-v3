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
		})

		expect(wrapper).toMatchSnapshot()
	})

	it('renders correctly with a header', () => {
		const wrapper = mount(DataListLoading, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				heading: true,
			},
		})

		expect(wrapper).toMatchSnapshot()
	})

	it('renders correctly with more items', () => {
		const wrapper = mount(DataListLoading, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				itemsNumber: 3,
			},
		})

		expect(wrapper).toMatchSnapshot()
	})

	it('renders correctly in row mode', () => {
		const wrapper = mount(DataListLoading, {
			global: {
				plugins: [vuetify],
			},
			propsData: {
				row: true,
			},
		})

		expect(wrapper).toMatchSnapshot()
	})
})
