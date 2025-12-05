import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AmeliproPostalAddressCityRow from '../AmeliproPostalAddressCityRow.vue'

describe('AmeliproPostalAddressCityRow', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPostalAddressCityRow, {
			props: {
				required: true,
				autoCompleteList: [
					{
						city: 'Nantes',
						disabled: false,
						postalCode: '44000',
					},
					{
						city: 'Paris',
						postalCode: '75000',
					},
					{
						city: 'Marseille',
						postalCode: '13000',
					},
				],
				disabled: true,
				uniqueId: 'the-groupId',
				readonly: true,
				modelValue: {
					postalCode: 'the-postalCode',
					city: 'the-city',
				},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
