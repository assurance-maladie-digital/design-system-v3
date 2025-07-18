import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMenu from '../AmeliproMenu.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproMenu', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMenu, {
			global: {
				plugins: [vuetify],
				stubs: {
					VNavigationDrawer: {
						template: '<div><slot></slot></div>',
					},
				},
			},
			props: {
				items: [
					{	actif: false,
						children: [
							{
								actif: false,
								children: [
									{
										id: '111',
										name: 'SubSubMenu 1.1.1',
										to: '/test',
									},
									{
										id: '112',
										name: 'SubSubMenu 1.1.2',
										to: '/test2',
									},
								],
								id: '11',
								name: 'SubMenu 1.1',
							},
							{
								actif: false,
								id: '12',
								name: 'SubMenu 1.2',
								to: '/test3',
							},
						],
						id: '1',
						name: 'Menu 1',
					},
					{
						actif: false,
						children: [
							{
								id: '21',
								name: 'SubMenu 2.1',
							},
							{
								actif: false,
								children: [
									{
										children: [],
										id: '211',
										name: 'SubSubMenu 2.1.1',
									},
									{
										children: [],
										id: '212',
										name: 'SubSubMenu 2.1.2',
									},
								],
								id: '22',
								name: 'SubMenu 2.2',
							},
						],
						id: '2',
						name: 'Menu 2',
					},
					{
						id: '3',
						name: 'Menu 3',
					},
				],
				uniqueId: 'amelipro-menu-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
