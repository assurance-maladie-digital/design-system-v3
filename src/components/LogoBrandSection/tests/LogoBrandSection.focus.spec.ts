import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LogoBrandSection from '../LogoBrandSection.vue'

// LogoBrandSection n'a aucun style de focus propre : quand un `homeLink` est fourni, le logo est
// enveloppé dans un vrai `<a>` (`.vd-home-link`), couvert par le ring global `_links.scss`. Sans
// homeLink interactif (ni `href` ni `to`), le conteneur est un `<div>` non focusable. On valide ici
// que la cible de focus est bien un `<a>` réel quand — et seulement quand — le lien est actif.
describe('LogoBrandSection - Focus', () => {
	it('wraps the logo in a real focusable anchor when homeLink.href is set (default)', () => {
		const wrapper = mount(LogoBrandSection)
		const link = wrapper.find('.vd-home-link')

		expect(link.exists()).toBe(true)
		expect(link.element.tagName).toBe('A')
		expect(link.attributes('href')).toBe('/')
	})

	// avec `homeLink.to` et sans vue-router enregistré, le conteneur retombait
	// sur un `<div>` — visuellement cliquable (cursor: pointer) mais impossible à atteindre au
	// clavier (RGAA 7.3). On vérifie qu'un vrai `<a href>` est rendu à la place.
	it('falls back to a real focusable anchor when homeLink.to is set without vue-router', () => {
		const wrapper = mount(LogoBrandSection, {
			props: { homeLink: { to: '/accueil' } },
		})
		const link = wrapper.find('.vd-home-link')

		expect(link.element.tagName).toBe('A')
		expect(link.attributes('href')).toBe('/accueil')
	})

	it('resolves the fallback href from an object route location', () => {
		const wrapper = mount(LogoBrandSection, {
			props: { homeLink: { to: { path: '/accueil' } } },
		})

		expect(wrapper.find('.vd-home-link').attributes('href')).toBe('/accueil')
	})

	it('falls back to homeLink.href for a named route that only the router can resolve', () => {
		const wrapper = mount(LogoBrandSection, {
			props: { homeLink: { to: { name: 'home' }, href: '/racine' } },
		})
		const link = wrapper.find('.vd-home-link')

		expect(link.element.tagName).toBe('A')
		expect(link.attributes('href')).toBe('/racine')
	})

	it('keeps using RouterLink when it is registered', () => {
		const wrapper = mount(LogoBrandSection, {
			global: { stubs: { RouterLink: true } },
			props: { homeLink: { to: '/accueil' } },
		})

		expect(wrapper.find('router-link-stub').attributes('to')).toBe('/accueil')
	})

	it('renders a non-focusable div container when homeLink has no href/to', () => {
		const wrapper = mount(LogoBrandSection, {
			props: { homeLink: {} },
		})
		const container = wrapper.find('.vd-home-link')

		expect(container.exists()).toBe(true)
		expect(container.element.tagName).toBe('DIV')
	})
})
