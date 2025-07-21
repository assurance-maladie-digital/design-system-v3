import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproSelect from '../AmeliproSelect.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproSelect', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproSelect, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						title: 'Lille',
						value: 1,
					},
					{
						title: 'Paris',
						value: 2,
					},
					{
						title: 'Bordeaux',
						value: 3,
					},
					{
						title: 'Tours',
						value: 4,
					},
					{
						title: 'Marseille',
						value: 5,
					},
				],
				label: 'Label du select',
				uniqueId: 'my-select-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
