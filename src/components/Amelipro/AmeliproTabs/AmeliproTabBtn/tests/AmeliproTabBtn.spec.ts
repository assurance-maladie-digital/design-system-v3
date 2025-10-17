import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTabBtn from '../AmeliproTabBtn.vue'

describe('AmeliproTabBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTabBtn, {
			props: {
				controls: 'content-id',
				tabindex: 0,
				uniqueId: 'my-tab-btn-id',
			},
			slot: {
				default: 'Label du bouton',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
