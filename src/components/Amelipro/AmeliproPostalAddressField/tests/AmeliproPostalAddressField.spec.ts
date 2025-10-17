import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproPostalAddressField from '../AmeliproPostalAddressField.vue'
describe('AmeliproPostalAddressField', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproPostalAddressField, {
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
