import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproBtn from '../AmeliproBtn.vue'

describe('AmeliproBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproBtn, {
			props: {
				color: 'ap-blue',
				default: 'My Button',
				hoverColor: 'ap-blue-lighten-3',
				textColor: 'ap-white',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
