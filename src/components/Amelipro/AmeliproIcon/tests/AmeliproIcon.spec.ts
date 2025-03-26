import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproIcon from '../AmeliproIcon.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproIcon', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproIcon, {
			global: {
				plugins: [vuetify],
			},
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
