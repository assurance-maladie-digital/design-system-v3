import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import ServiceMenu from '../ServiceMenu.vue'
describe('ServiceMenu', () => {
	it('render correctly', async () => {
		const wrapper = mount(ServiceMenu, {
			props: {
				modelValue: true,
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
				uniqueId: 'service-menu-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
