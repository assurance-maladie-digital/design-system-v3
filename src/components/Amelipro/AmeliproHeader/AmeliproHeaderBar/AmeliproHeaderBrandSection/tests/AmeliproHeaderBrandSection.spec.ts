import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproHeaderBrandSection from '../AmeliproHeaderBrandSection.vue'

describe('AmeliproHeaderBrandSection', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproHeaderBrandSection, {
			props: {
				uniqueId: 'amelipro-header-brand-section-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
