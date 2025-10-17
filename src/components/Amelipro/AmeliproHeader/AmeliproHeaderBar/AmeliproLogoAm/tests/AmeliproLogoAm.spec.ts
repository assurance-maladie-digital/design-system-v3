import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproLogoAm from '../AmeliproLogoAm.vue'
describe('AmeliproLogoAm', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproLogoAm, {
			props: {
				uniqueId: 'amelipro-logo-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
