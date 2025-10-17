import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import ServiceBtn from '../ServiceBtn.vue'
describe('ServiceBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(ServiceBtn, {
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
