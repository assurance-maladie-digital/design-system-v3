import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import SkipLink from '../SkipLink.vue'
import { locales } from '../locales.ts'

// Create a mock router
const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
		{ path: '/about', component: { template: '<div>About</div>' } },
	],
})

describe('SkipLink', () => {
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

	it('affiche les liens fournis dans skipLinks', () => {
		const wrapper = mount(SkipLink, {
			props: {
				skipLinks: [
					{ label: 'Aller au contenu', target: '#main' },
					{ label: 'Aller au pied de page', target: '#footer' },
				],
			},
		})

		const links = wrapper.findAll('a.sy-skip-link')
		expect(links).toHaveLength(2)
		expect(links[0]!.text()).toBe('Aller au contenu')
		expect(links[0]!.attributes('href')).toBe('#main')
		expect(links[1]!.text()).toBe('Aller au pied de page')
		expect(links[1]!.attributes('href')).toBe('#footer')
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

	it('permet de surcharger les textes via la prop locales', () => {
		const wrapper = mount(SkipLink, {
			props: {
				locales: {
					label: 'Skip to main content',
					ariaLabel: 'Skip links',
				},
			},
		})

		expect(wrapper.find('a.sy-skip-link').text()).toBe('Skip to main content')
		expect(wrapper.find('nav').attributes('aria-label')).toBe('Skip links')
	})

	it('la prop label est prioritaire sur les locales', () => {
		const wrapper = mount(SkipLink, {
			props: {
				label: 'Accéder au contenu',
				locales: { label: 'Skip to main content' },
			},
		})

		expect(wrapper.find('a.sy-skip-link').text()).toBe('Accéder au contenu')
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
