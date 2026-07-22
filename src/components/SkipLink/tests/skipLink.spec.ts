import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SkipLink from '../SkipLink.vue'
import { locales } from '../locales'

// Create a mock router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
		{ path: '/about', component: { template: '<div>About</div>' } },
	],
})

describe('SkipLink', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('renders correctly', async () => {
		const wrapper = mount(SkipLink, {
			global: {
				plugins: [router],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('accepte des props personnalisées', () => {
		const customLabel = 'Accéder au contenu'
		const customTarget = '#content'

		const wrapper = mount(SkipLink, {
			props: {
				label: customLabel,
				target: customTarget,
			},
		})

		const link = wrapper.find('a.sy-skip-link')
		expect(link.text()).toBe(customLabel)
		expect(link.attributes('href')).toBe(customTarget)
	})

	it('utilise les valeurs par défaut', () => {
		const wrapper = mount(SkipLink)

		const link = wrapper.find('a.sy-skip-link')
		expect(link.text()).toBe(locales.label)
		expect(link.attributes('href')).toBe('#main')
	})

	it('contient les attributs d\'accessibilité corrects', () => {
		const wrapper = mount(SkipLink)

		expect(wrapper.find('nav').attributes('aria-label')).toBe('Liens d\'évitement')
		expect(wrapper.find('a.sy-skip-link').exists()).toBe(true)
	})

	it('ne déplace pas le focus si la navigation échoue', async () => {
		// Mock du router avec un hook afterEach qui simule un échec
		const mockRouter = {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			afterEach: (callback: any) => {
				// Simuler un appel avec fail=true
				callback(
					{ path: '/new-path' },
					{ path: '/' },
					true, // fail=true
				)
			},
		}

		// Espionner querySelector et focus
		const linkElement = document.createElement('a')
		const focusSpy = vi.spyOn(linkElement, 'focus')
		vi.spyOn(document, 'querySelector').mockImplementation(() => linkElement)

		// Mock de getCurrentInstance pour injecter notre router
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		vi.spyOn(require('vue'), 'getCurrentInstance').mockReturnValue({
			appContext: {
				app: {
					config: {
						globalProperties: {
							$router: mockRouter,
						},
					},
				},
			},
		})

		mount(SkipLink)
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(focusSpy).not.toHaveBeenCalled()
	})

	it('ne déplace pas le focus si le chemin reste identique', async () => {
		// Mock du router avec un hook afterEach où to.path = from.path
		const mockRouter = {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
			afterEach: (callback: any) => {
				// Simuler un appel avec les mêmes chemins
				callback(
					{ path: '/same-path' },
					{ path: '/same-path' },
					false,
				)
			},
		}

		// Espionner querySelector et focus
		const linkElement = document.createElement('a')
		const focusSpy = vi.spyOn(linkElement, 'focus')
		vi.spyOn(document, 'querySelector').mockImplementation(() => linkElement)

		// Mock de getCurrentInstance
		/* eslint-disable */
		vi.spyOn(require('vue'), 'getCurrentInstance').mockReturnValue({
			appContext: {
				app: {
					config: {
						globalProperties: {
							$router: mockRouter,
						},
					},
				},
			},
		})

		mount(SkipLink)
		await new Promise(resolve => setTimeout(resolve, 0))

		expect(focusSpy).not.toHaveBeenCalled()
	})
})

// Le ring de focus est scopé sur `:focus` (jsdom ne calcule pas le style) : on vérifie
// le prérequis — un <a> natif focusable (le lien n'est visible qu'au focus).
describe('SkipLink - focus', () => {
	it('renders a native <a> so the focus ring applies', () => {
		const wrapper = mount(SkipLink, { props: { label: 'Aller au contenu', target: '#main' } })
		expect(wrapper.get('.sy-skip-link').element.tagName).toBe('A')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(SkipLink, {
			props: { label: 'Aller au contenu', target: '#main' },
			attachTo: document.body,
		})
		const link = wrapper.get('.sy-skip-link').element as HTMLAnchorElement
		link.focus()
		expect(document.activeElement).toBe(link)
		wrapper.unmount()
	})
})
