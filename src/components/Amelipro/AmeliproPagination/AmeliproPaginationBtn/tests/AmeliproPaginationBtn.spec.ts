import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPaginationBtn from '../AmeliproPaginationBtn.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproPaginationBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPaginationBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'my-pagination-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
