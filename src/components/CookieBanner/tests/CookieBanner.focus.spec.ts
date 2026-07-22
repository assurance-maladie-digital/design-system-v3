import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CookieBanner from '../CookieBanner.vue'

const mountBanner = () =>
	mount(CookieBanner, {
		props: { modelValue: true },
		global: { stubs: { Teleport: true } },
	})

// CookieBanner ne porte aucun style de focus propre : ses cibles focusables sont des `.v-btn`
// standalone (fermer, personnaliser, refuser, accepter) sur le fond clair de la VSheet, couvertes
// par le ring global `_btns.scss`. Le rendu (ring non rogné) est couvert par le visuel. On valide
// ici que ces cibles sont de vrais boutons focusables.
describe('CookieBanner - Focus', () => {
	it.each(['customize', 'reject', 'accept'])(
		'renders a real focusable "%s" action button',
		(testId) => {
			const wrapper = mountBanner()
			const btn = wrapper.find(`[data-test-id="${testId}"]`)

			expect(btn.exists()).toBe(true)
			expect(btn.element.tagName).toBe('BUTTON')
			expect(btn.attributes('tabindex')).not.toBe('-1')
		},
	)

	it('renders a real focusable close button', () => {
		const wrapper = mountBanner()
		const closeBtn = wrapper.find('.vd-cookie-banner__inner .v-btn')

		expect(closeBtn.exists()).toBe(true)
		expect(closeBtn.element.tagName).toBe('BUTTON')
		expect(closeBtn.attributes('tabindex')).not.toBe('-1')
	})
})
