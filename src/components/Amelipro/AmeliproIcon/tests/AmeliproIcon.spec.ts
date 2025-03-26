import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproIcon from '../AmeliproIcon.vue'

describe('AmeliproIcon', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproIcon, {
			props: {
				icon: 'ap-icone-ajouter',
				size: 24,
				color: 'ap-blue',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
