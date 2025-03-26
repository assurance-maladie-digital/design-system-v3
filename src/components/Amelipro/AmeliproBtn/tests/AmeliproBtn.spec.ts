import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproBtn from '../AmeliproBtn.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				default: 'My Button',
				uniqueId: 'my-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
