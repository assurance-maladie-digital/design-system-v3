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
				uniqueId: 'my-btn-id',
			},
			slots: {
				default: 'My Button',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
