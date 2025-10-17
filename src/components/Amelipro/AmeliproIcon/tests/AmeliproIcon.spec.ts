import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproIcon from '../AmeliproIcon.vue'
describe('AmeliproIcon', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproIcon, {
			props: {
				icon: 'utilisateur',
				iconBgColor: 'ap-blue-darken-1',
				iconColor: 'ap-white',
				uniqueId: 'amelipro-icon-id',
				xLarge: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
