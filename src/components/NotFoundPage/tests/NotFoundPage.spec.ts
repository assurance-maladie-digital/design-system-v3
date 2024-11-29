import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import { vuetify } from '@tests/unit/setup'
import { locales } from '../locales'
import NotFoundPage from '../NotFoundPage.vue'

describe('NotFoundPage', () => {
	it('renders correctly', () => {
		const wrapper = mount(NotFoundPage, {
			global: {
				plugins: [vuetify],
			},
		})

		expect(wrapper.text()).toContain(locales.code)
		expect(wrapper.text()).toContain(locales.message)
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('display the support ID if provided in the url', async () => {
		history.replaceState(
			{},
			'',
			'/not-found?support_id=1234567890123456789',
		)
		const wrapper = mount(NotFoundPage, {
			global: {
				plugins: [vuetify],
			},
		})

		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('1234 5678 9012 3456 789')
		expect(wrapper.html()).toMatchSnapshot()
	})
})
