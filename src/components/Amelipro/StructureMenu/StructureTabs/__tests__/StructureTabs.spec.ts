import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import StructureTabs from '../StructureTabs.vue'
import { vuetify } from '@tests/unit/setup'

describe('StructureTabs', () => {
	it('render correctly', async () => {
		const wrapper = mount(StructureTabs, {
			global: {
				plugins: [vuetify],
			},
			props: {
				ariaLabel: 'mon label',
				tabs: [
					{
						label: 'onlget 1',
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
						listLabel: 'liste-structures-1',
					},
					{
						label: 'onlget 2',
						structures: [
							{
								address: 'address 4',
								idNumber: '4',
								value: 'valeur 4',
							},
							{
								address: 'address 5',
								idNumber: '5',
								value: 'valeur 5',
							},
							{
								address: 'address 6',
								idNumber: '6',
								value: 'valeur 6',
							},
						],
						listLabel: 'liste-structures-2',
					},
				],
				uniqueId: 'my-tabs-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
