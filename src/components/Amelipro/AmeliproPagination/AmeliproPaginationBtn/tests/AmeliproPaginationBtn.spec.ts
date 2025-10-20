import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPaginationBtn from '../AmeliproPaginationBtn.vue'

describe('AmeliproPaginationBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPaginationBtn, {
			props: {
				uniqueId: 'my-pagination-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
