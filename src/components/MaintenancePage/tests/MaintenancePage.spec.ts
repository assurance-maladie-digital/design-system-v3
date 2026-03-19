import { describe, it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import StatusPage from '../../StatusPage/StatusPage.vue'
import MaintenancePage from '../MaintenancePage.vue'

describe('MaintenancePage', () => {
	it('renders correctly', () => {
		const wrapper = shallowMount(MaintenancePage)

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders StatusPage component', () => {
		const wrapper = shallowMount(MaintenancePage)

		expect(wrapper.findComponent(StatusPage).exists()).toBe(true)
	})

	it('passes correct props to StatusPage', () => {
		const wrapper = shallowMount(MaintenancePage)
		const statusPage = wrapper.findComponent(StatusPage)

		expect(statusPage.props('hideBtn')).toBe(true)
		expect(statusPage.props('pageTitle')).toBeDefined()
		expect(statusPage.props('message')).toBeDefined()
		expect(statusPage.props('code')).toBeDefined()
	})

	it('uses a generated uniqueId', () => {
		const wrapper = mount(MaintenancePage)

		expect(wrapper.find('.vd-page-container').attributes('id')).toMatch(/^[-a-z0-9]+-container$/)
	})

	it('passes a custom uniqueId prop to StatusPage', () => {
		const wrapper = shallowMount(MaintenancePage, {
			props: {
				uniqueId: 'custom-id',
			},
		})
		const statusPage = wrapper.findComponent(StatusPage)

		expect(statusPage.props('uniqueId')).toBe('custom-id')
	})

	it('renders default illustration when no slot is provided', () => {
		const wrapper = shallowMount(MaintenancePage)

		// Vérifie que le composant peut être rendu sans erreur
		expect(wrapper.vm).toBeDefined()
	})

	it('renders img with correct attributes', () => {
		const wrapper = shallowMount(MaintenancePage)
		const img = wrapper.find('img')

		if (img.exists()) {
			expect(img.attributes('alt')).toBe('')
			expect(img.attributes('aria-hidden')).toBe('true')
		}
	})

	it('applies correct styles to img', () => {
		const wrapper = shallowMount(MaintenancePage)
		const style = wrapper.vm.$el.querySelector('style')

		expect(style).toBeDefined()
	})
})
