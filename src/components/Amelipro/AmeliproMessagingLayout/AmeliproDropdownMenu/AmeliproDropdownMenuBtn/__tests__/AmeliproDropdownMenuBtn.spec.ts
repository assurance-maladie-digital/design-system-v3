import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproDropdownMenuBtn from '../AmeliproDropdownMenuBtn.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproDropdownMenuBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproDropdownMenuBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				label: 'label du bouton',
				uniqueId: 'my-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
