import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproLogoAm from '../AmeliproLogoAm.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproLogoAm', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproLogoAm, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'amelipro-logo-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
