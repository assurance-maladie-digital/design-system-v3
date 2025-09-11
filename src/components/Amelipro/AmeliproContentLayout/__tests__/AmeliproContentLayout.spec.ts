import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproContentLayout from '../AmeliproContentLayout.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproContentLayout', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproContentLayout, {
			global: {
				plugins: [vuetify],
			},
			props: {
				bgColor: 'ap-blue',
				uniqueId: 'my-content-layout-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
