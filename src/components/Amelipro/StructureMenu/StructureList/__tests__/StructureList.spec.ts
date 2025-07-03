import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import StructureList from '../StructureList.vue'
import { vuetify } from '@tests/unit/setup'

describe('StructureList', () => {
	it('render correctly', async () => {
		const wrapper = mount(StructureList, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'mon label',
				name: 'my-name',
				structures: [
					{
						address: 'address 1',
						idNumber: '1',
						value: 'valeur 1',
					},
					{
						address: 'address 2',
						idNumber: '2',
						value: 'valeur 2',
					},
					{
						address: 'address 3',
						idNumber: '3',
						value: 'valeur 3',
					},
				],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
