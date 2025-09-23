import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproFirstLogin from '../AmeliproFirstLogin.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproFirstLogin', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproFirstLogin, {
			global: {
				plugins: [vuetify],
				stubs: {
					VDialog: {
						template: '<div><slot></slot></div>',
					},
				},
			},
			props: {
				mainContentMaxHeight: 'modified-main-content-max-height',
				mainContentMinHeight: 'modified-main-content-min-height',
				modelValue: true,
				moreInfoHref: '#modified-more-info-href',
				moreInfoTo: '/home',
				uniqueId: 'modified-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
