import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproHeaderBrandSection from '../AmeliproHeaderBrandSection.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproHeaderBrandSection', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproHeaderBrandSection, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'amelipro-header-brand-section-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
