import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import ServiceMenuContent from '../ServiceMenuContent.vue'

describe('ServiceMenuContent', () => {
	it('render correctly', async () => {
		const wrapper = mount(ServiceMenuContent, {
			props: {
				servicesPs: [
					{
						icon: 'releveHonoraires',
						label: 'relevé honoraires',
					},
					{
						icon: 'horairesCabinet',
						label: 'horaires cabinet',
					},
				],
				servicesPatient: [
					{
						icon: 'releveHonoraires',
						label: 'relevé honoraires Patient',
					},
					{
						icon: 'horairesCabinet',
						label: 'horaires cabinet Patient',
					},
				],
				servicesContact: [
					{
						icon: 'releveHonoraires',
						label: 'relevé honoraires Contact',
					},
					{
						icon: 'horairesCabinet',
						label: 'horaires cabinet Contact',
					},
				],
				uniqueId: 'service-menu-content-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
