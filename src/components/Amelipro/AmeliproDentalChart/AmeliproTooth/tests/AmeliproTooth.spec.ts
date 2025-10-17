import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTooth from '../AmeliproTooth.vue'
describe('AmeliproTooth', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTooth, {
			props: {
				toothNumber: '36',
				uniqueId: 'my-tooth-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
