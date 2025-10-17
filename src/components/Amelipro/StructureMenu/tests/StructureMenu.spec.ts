import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import StructureMenu from '../StructureMenu.vue'

describe('StructureMenu', () => {
	it('render correctly', async () => {
		const wrapper = mount(StructureMenu, {
			global: {
				stubs: {
					VDialog: {
						template: '<div><slot></slot></div>',
					},
				},
			},
			props: {
				modelValue: { dialog: true, activeTab: 0 },
				structuresTabs: [
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
					},
				],
				uniqueId: 'my-structure-menu-id',
				userAdeli: 'n° Adeli',
				userName: 'Jean Martin',
				userProfession: 'Médecin génraliste',
				userRpps: 'n° RPPS',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
