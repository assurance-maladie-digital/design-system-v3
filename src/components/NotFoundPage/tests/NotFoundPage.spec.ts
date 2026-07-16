import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import NotFoundPage from '../NotFoundPage.vue'
import StatusPage from '../../StatusPage/StatusPage.vue'

vi.mock('@/utils/theme', () => ({
	useThemeLocales: () => ({
		themeLocales: ref({
			code: '404',
			pageTitle: 'Page non trouvée',
			message: 'Cette page n\'existe pas ou a été déplacée.',
			src: '/src/components/NotFoundPage/assets/not-found.svg',
		}),
	}),
}))

describe('NotFoundPage', () => {
	beforeEach(() => {
		history.replaceState({}, '', '/')
	})

	it('renders correctly', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(StatusPage).exists()).toBe(true)
		expect(wrapper.text()).toContain('404')
		expect(wrapper.text()).toContain('Page non trouvée')
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('display the support ID if provided in the url', async () => {
		history.replaceState({}, '', '/not-found?support_id=1234567890123456789')

		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).toContain('Votre identifiant de support est')
		expect(wrapper.text()).toContain('1234 5678 9012 3456 789')
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('does not display support ID section when no support_id in url', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.text()).not.toContain('Votre identifiant de support est')
	})

	it('renders StatusPage with correct props', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		const statusPage = wrapper.findComponent(StatusPage)
		expect(statusPage.props('code')).toBe('404')
		expect(statusPage.props('pageTitle')).toBe('Page non trouvée')
		expect(statusPage.props('message')).toBe('Cette page n\'existe pas ou a été déplacée.')
	})

	it('renders with custom button props', async () => {
		const wrapper = mount(NotFoundPage, {
			props: {
				btnText: 'Retour à l\'accueil',
				btnHref: '/',
			},
		})
		await flushPromises()
		await wrapper.vm.$nextTick()

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
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(StatusPage).props('hideBtn')).toBe(true)
	})

	it('renders illustration with correct accessibility attributes', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('/src/components/NotFoundPage/assets/not-found.svg')
		expect(img.attributes('alt')).toBe('')
		expect(img.attributes('aria-hidden')).toBe('true')
	})

	it('renders custom illustration slot', async () => {
		const wrapper = mount(NotFoundPage, {
			slots: {
				illustration: '<img src="/custom.svg" alt="" aria-hidden="true" />',
			},
		})
		await flushPromises()
		await wrapper.vm.$nextTick()

		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('/custom.svg')
	})

	it('uses a generated uniqueId', async () => {
		const wrapper = mount(NotFoundPage)
		await flushPromises()
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.vd-page-container').attributes('id')).toMatch(/^[-a-z0-9]+-container$/)
	})

	it('passes a custom uniqueId prop to StatusPage', async () => {
		const wrapper = mount(NotFoundPage, {
			props: {
				uniqueId: 'custom-id',
			},
		})
		await flushPromises()
		await wrapper.vm.$nextTick()

		const statusPage = wrapper.findComponent(StatusPage)
		expect(statusPage.props('uniqueId')).toBe('custom-id')
	})
})

// Wrapper de StatusPage : le bouton d'action est un VBtn → ring de focus via l'override
// global (_btns.scss). jsdom ne calcule pas :focus-visible : on vérifie le prérequis —
// le bouton rend un élément natif focusable.
describe('NotFoundPage - focus', () => {
	const btnProps = { btnText: 'Retour à l\'accueil', btnHref: 'https://example.com' }

	it('renders the action button as a native <a> so the global focus ring applies', () => {
		const wrapper = mount(NotFoundPage, { props: btnProps })
		expect(wrapper.get('.v-btn').element.tagName).toBe('A')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(NotFoundPage, { props: btnProps, attachTo: document.body })
		const btn = wrapper.get('.v-btn').element as HTMLElement
		btn.focus()
		expect(document.activeElement).toBe(btn)
		wrapper.unmount()
	})
})
