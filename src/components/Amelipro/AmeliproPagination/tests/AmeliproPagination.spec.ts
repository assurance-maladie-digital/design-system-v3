import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPagination from '../AmeliproPagination.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproPagination', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPagination, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'my-pagination-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
