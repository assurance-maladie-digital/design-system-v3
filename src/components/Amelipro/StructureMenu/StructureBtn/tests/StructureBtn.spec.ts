import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import StructureBtn from '../StructureBtn.vue'
describe('StructureBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(StructureBtn, {
			props: {
				controls: 'control-id',
				tabindex: 0,
				uniqueId: 'my-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
