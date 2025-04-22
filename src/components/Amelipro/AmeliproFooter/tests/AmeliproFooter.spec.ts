import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproFooter from '../AmeliproFooter.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproFooter', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproFooter, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'my-footer-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
