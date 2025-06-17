import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTransmission from '../AmeliproTransmission.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproTransmission', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTransmission, {
			global: {
				plugins: [vuetify],
			},
			props: {
				transmissionCardTitle: 'Titre de la carte',
				uniqueId: 'my-transmission-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
