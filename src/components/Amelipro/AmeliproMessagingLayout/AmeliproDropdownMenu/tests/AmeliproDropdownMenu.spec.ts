import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproDropdownMenu from '../AmeliproDropdownMenu.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproDropdownMenu', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproDropdownMenu, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						label: 'item 1',
					},
					{
						label: 'item 2',
						active: true,
					},
					{
						label: 'item 3',
					},
				],
				label: 'menu déroulant',
				uniqueId: 'my-dropdown-menu-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
