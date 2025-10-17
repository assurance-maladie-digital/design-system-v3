import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTextArea from '../AmeliproTextArea.vue'

describe('AmeliproTextArea', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTextArea, {
			props: {
				label: 'Mon label',
				uniqueId: 'my-textarea-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
