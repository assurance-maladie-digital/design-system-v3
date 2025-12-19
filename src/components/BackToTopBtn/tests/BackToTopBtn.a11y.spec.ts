// @vitest-environment jsdom

import { afterEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import BackToTopBtn from '../BackToTopBtn.vue'

// Scénario d’accessibilité : bouton affiché après défilement de la page,
// avec son libellé par défaut et son icône.

describe('BackToTopBtn – accessibility (axe)', () => {
	afterEach(() => {
		vi.restoreAllMocks()
		// Nettoyer le DOM entre les tests
		document.body.innerHTML = ''
	})

	it('has no obvious axe violations when visible after scroll', async () => {
		// Position de scroll initiale à 0
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)

		const wrapper = mount(BackToTopBtn, {
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		// Simuler un défilement suffisant pour afficher le bouton
		vi.spyOn(window, 'scrollY', 'get').mockReturnValue(500)
		window.dispatchEvent(new CustomEvent('scroll'))
		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		expect(results.violations).toEqual([])
	})
})
