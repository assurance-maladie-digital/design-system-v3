import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPostalAddressCityRow from '../AmeliproPostalAddressCityRow.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproPostalAddressCityRow', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPostalAddressCityRow, {
			global: {
				plugins: [vuetify],
			},
			props: {
				ariaRequired: true,
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
