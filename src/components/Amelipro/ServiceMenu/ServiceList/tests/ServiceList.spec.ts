import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import ServiceList from '../ServiceList.vue'

describe('ServiceList', () => {
	it('render correctly', async () => {
		const wrapper = mount(ServiceList, {
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
