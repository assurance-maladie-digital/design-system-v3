import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTransmission from '../AmeliproTransmission.vue'
describe('AmeliproTransmission', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTransmission, {
			props: {
				transmissionCardTitle: 'Titre de la carte',
				uniqueId: 'my-transmission-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
