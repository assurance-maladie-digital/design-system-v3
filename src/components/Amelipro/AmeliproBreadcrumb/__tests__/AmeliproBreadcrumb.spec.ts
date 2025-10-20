import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproBreadcrumb from '../AmeliproBreadcrumb.vue'

describe('AmeliproBreadcrumb', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproBreadcrumb, {
			props: {
				items: [
					{
						id: 'breadcrumb-item-id-1',
						title: 'Breadcrumb item 1',
					},
					{
						id: 'breadcrumb-item-id-2',
						title: 'Breadcrumb item 2',
					},
					{
						id: 'breadcrumb-item-id-3',
						title: 'Breadcrumb item 3',
					},
					{
						id: 'breadcrumb-item-id-4',
						title: 'Breadcrumb item 4',
					},
				],
				uniqueId: 'amelipro-breadcrumb-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
