import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTextField from '../AmeliproTextField.vue'

describe('AmeliproTextField', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTextField, {
			props: {
				label: 'Mon label',
				uniqueId: 'my-textfield-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
