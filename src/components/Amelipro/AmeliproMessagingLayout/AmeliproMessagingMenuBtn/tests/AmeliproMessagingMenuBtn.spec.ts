import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMessagingMenuBtn from '../AmeliproMessagingMenuBtn.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproMessagingMenuBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMessagingMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'label du bouton',
				uniqueId: 'my-messaging-menu-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
