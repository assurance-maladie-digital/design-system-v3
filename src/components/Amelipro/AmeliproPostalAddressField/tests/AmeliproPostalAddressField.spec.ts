import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPostalAddressField from '../AmeliproPostalAddressField.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproPostalAddressField', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPostalAddressField, {
			global: {
				plugins: [vuetify],
			},
			props: {
				ariaRequired: true,
				uniqueId: 'the-groupId',
				groupLabel: 'the-groupLabel',
				modelValue: {
					additionalInfo: 'the-additionalInfo',
					address: 'the-address',
					postalCode: 'the-postalCode',
					city: 'the-city',
				},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
