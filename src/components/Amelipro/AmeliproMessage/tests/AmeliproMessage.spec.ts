import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMessage from '../AmeliproMessage.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproMessage', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMessage, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'my-message-id',
			},
			slots: {
				default: 'Contenu de mon Message',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
