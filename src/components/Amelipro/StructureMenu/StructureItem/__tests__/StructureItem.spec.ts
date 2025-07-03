import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import StructureItem from '../StructureItem.vue'
import { vuetify } from '@tests/unit/setup'

describe('StructureItem', () => {
	it('render correctly', async () => {
		const wrapper = mount(StructureItem, {
			global: {
				plugins: [vuetify],
			},
			props: {
				groupName: 'group-name',
				item: {
					address: 'address',
					idNumber: '1',
					value: 'valeur',
				},
				uniqueId: 'my-item-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
