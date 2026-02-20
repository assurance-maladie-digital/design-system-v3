import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NotFoundPage from '../NotFoundPage.vue'
import StatusPage from '../../StatusPage/StatusPage.vue'

describe('NotFoundPage', () => {
	it('renders correctly', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()

		expect(wrapper.findComponent(StatusPage).exists()).toBe(true)
		expect(wrapper.text()).toContain('404')
		expect(wrapper.text()).toContain('Page non trouvée')
	})

	it('renders StatusPage with correct props', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()

		const statusPage = wrapper.findComponent(StatusPage)
		expect(statusPage.props('code')).toBe('404')
		expect(statusPage.props('pageTitle')).toBe('Page non trouvée')
		expect(statusPage.props('message')).toBeDefined()
	})

	it('renders with custom button props', async () => {
		const wrapper = mount(NotFoundPage, {
			props: {
				btnText: 'Retour à l\'accueil',
				btnHref: '/',
			},
		})
		await flushPromises()

		const statusPage = wrapper.findComponent(StatusPage)
		expect(statusPage.props('btnText')).toBe('Retour à l\'accueil')
		expect(statusPage.props('btnHref')).toBe('/')
	})

	it('hides button when hideBtn prop is true', async () => {
		const wrapper = mount(NotFoundPage, {
			props: {
				hideBtn: true,
			},
		})
		await flushPromises()

		expect(wrapper.findComponent(StatusPage).props('hideBtn')).toBe(true)
	})
})
