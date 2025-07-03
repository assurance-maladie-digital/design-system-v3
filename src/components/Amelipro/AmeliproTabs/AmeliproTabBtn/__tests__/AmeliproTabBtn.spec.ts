import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTabBtn from '../AmeliproTabBtn.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproTabBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTabBtn, {
			global: {
				plugins: [vuetify],
			},
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
