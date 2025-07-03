import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproStepBtn from '../AmeliproStepBtn.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproStepBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproStepBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				uniqueId: 'my-step-btn-id',
			},
			slots: {
				default: 'Libellé du bouton',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
