import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPagination from '../AmeliproPagination.vue'

describe('AmeliproPagination', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPagination, {
			props: {
				uniqueId: 'my-pagination-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
