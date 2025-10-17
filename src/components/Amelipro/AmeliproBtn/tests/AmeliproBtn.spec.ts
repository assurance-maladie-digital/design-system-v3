import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproBtn from '../AmeliproBtn.vue'

describe('AmeliproBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproBtn, {
			props: {
				uniqueId: 'my-btn-id',
			},
			slots: {
				default: 'My Button',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
