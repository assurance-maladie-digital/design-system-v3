import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproContentLayout from '../AmeliproContentLayout.vue'
describe('AmeliproContentLayout', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproContentLayout, {
			props: {
				bgColor: 'ap-blue',
				uniqueId: 'my-content-layout-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
