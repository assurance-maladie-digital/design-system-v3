import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import ServiceBtn from '../ServiceBtn.vue'
import { vuetify } from '@tests/unit/setup'

describe('ServiceBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(ServiceBtn, {
			global: {
				plugins: [vuetify],
			},
			props: {
				iconBgColor: 'ap-blue',
				iconHoverBgColor: 'ap-yellow',
				item: {
					icon: 'releveHonoraires',
					label: 'relevé honoraires',
				},
				uniqueId: 'service-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})
