import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import DataListGroup from '../DataListGroup.vue'

import { dataListGroupItems } from './data/dataListGroupItems'

describe('DataListGroup', () => {
	it('renders correctly', () => {
		const wrapper = mount(DataListGroup, {
			props: {
				items: dataListGroupItems,
			},
		})

		expect(wrapper.find('h4').text()).toBe('Catégorie 1')
	})

	it('renders loading state correctly', async () => {
		const wrapper = mount(DataListGroup, {
			props: {
				loading: true,
				items: dataListGroupItems,
			},
		})

		expect(wrapper.find('.sy-data-list-loading').exists()).toBe(true)
	})

	it('emit the right event when clicking on a item button', async () => {
		const wrapper = mount(DataListGroup, {
			props: {
				items: dataListGroupItems,
			},
		})

		const button = wrapper.find('button')
		await button.trigger('click')

		expect(wrapper.emitted('click:list-item')).toEqual([
			[{ dataListIndex: 1, itemIndex: 0 }],
		])
	})
})
