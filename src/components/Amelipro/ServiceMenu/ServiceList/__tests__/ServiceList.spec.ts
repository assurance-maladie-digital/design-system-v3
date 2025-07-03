import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import ServiceList from '../ServiceList.vue'
import { vuetify } from '@tests/unit/setup'

describe('ServiceList', () => {
	it('render correctly', async () => {
		const wrapper = mount(ServiceList, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						icon: 'releveHonoraires',
						label: 'relevé honoraires',
					},
					{
						icon: 'horairesCabinet',
						label: 'horaires cabinet',
					},
				],
				uniqueId: 'service-list-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
