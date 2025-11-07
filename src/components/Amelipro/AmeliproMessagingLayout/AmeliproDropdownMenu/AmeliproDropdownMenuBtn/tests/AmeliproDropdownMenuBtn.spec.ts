import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproDropdownMenuBtn from '../AmeliproDropdownMenuBtn.vue'

describe('AmeliproDropdownMenuBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproDropdownMenuBtn, {
			props: {
				label: 'label du bouton',
				uniqueId: 'my-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
