import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproFooter from '../AmeliproFooter.vue'
describe('AmeliproFooter', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproFooter, {
			props: {
				uniqueId: 'my-footer-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
