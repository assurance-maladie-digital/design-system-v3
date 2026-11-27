// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MaintenancePage from '../MaintenancePage.vue'

describe('MaintenancePage – executable RGAA contracts', () => {
	it('renders a semantic heading and a decorative illustration', () => {
		const wrapper = mount(MaintenancePage, { props: { pageTitle: 'Maintenance', message: 'Service indisponible', code: '503' } })
		expect(wrapper.find('h1, h2, h3, h4, h5, h6').exists()).toBe(true)
		const image = wrapper.find('img')
		if (image.exists()) expect(image.attributes('aria-hidden')).toBe('true')
	})
})
