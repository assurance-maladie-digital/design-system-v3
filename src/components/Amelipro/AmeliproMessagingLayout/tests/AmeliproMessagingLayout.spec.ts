import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMessagingLayout from '../AmeliproMessagingLayout.vue'
describe('AmeliproMessagingLayout', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMessagingLayout, {
			props: {
				items: [
					{
						label: 'item 1',
						icon: 'pencilNoCircle',
					},
					{
						label: 'item 2',
						icon: 'stats',
						active: true,
					},
					{
						label: 'item 2',
						icon: 'trashNoCircle',
					},
				],
				uniqueId: 'my-messaging-layout-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
