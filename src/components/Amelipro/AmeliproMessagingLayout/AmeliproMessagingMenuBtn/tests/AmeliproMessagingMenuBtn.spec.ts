import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMessagingMenuBtn from '../AmeliproMessagingMenuBtn.vue'

describe('AmeliproMessagingMenuBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMessagingMenuBtn, {
			props: {
				label: 'label du bouton',
				uniqueId: 'my-messaging-menu-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
