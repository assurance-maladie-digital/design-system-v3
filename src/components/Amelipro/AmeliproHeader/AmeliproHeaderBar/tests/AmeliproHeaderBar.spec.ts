import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproHeaderBar from '../AmeliproHeaderBar.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproHeaderBar', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproHeaderBar, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'amelipro-header-bar-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
