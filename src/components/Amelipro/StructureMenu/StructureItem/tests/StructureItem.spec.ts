import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import StructureItem from '../StructureItem.vue'
describe('StructureItem', () => {
	it('render correctly', async () => {
		const wrapper = mount(StructureItem, {
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
