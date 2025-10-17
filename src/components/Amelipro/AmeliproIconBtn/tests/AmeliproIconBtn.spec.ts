import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproIconBtn from '../AmeliproIconBtn.vue'

describe('AmeliproIconBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproIconBtn, {
			props: {
				btnLabel: 'Libellé du bouton',
				icon: 'utilisateur',
				iconBgColor: 'ap-blue-darken-1',
				iconColor: 'ap-white',
				iconHoverBgColor: 'ap-blue-darken-2',
				iconHoverColor: 'ap-white',
				uniqueId: 'amelipro-icon-id',
				xLarge: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
