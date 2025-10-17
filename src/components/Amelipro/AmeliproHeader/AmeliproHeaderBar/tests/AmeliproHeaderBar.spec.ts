import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproHeaderBar from '../AmeliproHeaderBar.vue'
describe('AmeliproHeaderBar', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproHeaderBar, {
			props: {
				uniqueId: 'amelipro-header-bar-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
