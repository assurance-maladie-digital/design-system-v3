import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproAutoCompleteField from '../AmeliproAutoCompleteField.vue'

describe('AmeliproAutoCompleteField', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproAutoCompleteField, {
			props: {
				items: [
					{
						title: 'Bordeaux',
						value: 'Bordeaux',
					},
					{
						title: 'Bagnolet',
						value: 'Bagnolet',
					},
					{
						title: 'Bagneux',
						value: 'Bagneux',
					},
					{
						title: 'Arcachon',
						value: 'Arcachon',
					},
					{
						title: 'Paris',
						value: 'Paris',
					},
					{
						title: 'Lille',
						value: 'Lille',
					},
					{
						title: 'Lyon',
						value: 'Lyon',
					},
					{
						title: 'Brest',
						value: 'Brest',
					},
					{
						title: 'Marseille',
						value: 'Marseille',
					},
					{
						title: 'Toulouse',
						value: 'Toulouse',
					},
				],
				label: 'Mon label',
				uniqueId: 'my-AutoCompleteField-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
