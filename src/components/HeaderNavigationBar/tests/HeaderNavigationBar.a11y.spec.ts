// @vitest-environment jsdom

import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import HeaderNavbar from '../HeaderNavigationBar.vue'

// Scénario d’accessibilité : barre de navigation avec onglets horizontaux en mode desktop.

vi.mock('@/utils/functions/throttleDisplayFn/throttleDisplayFn.ts', () => ({
	default: (fn: (...args: unknown[]) => void) => fn,
}))

describe('HeaderNavigationBar – accessibility (axe)', () => {
	it('has no obvious axe violations in desktop horizontal mode', async () => {
		// @ts-expect-error  - Property 'happyDOM' does not exist on type 'Window & typeof globalThis'.
		window.window.happyDOM.setInnerWidth(1200)

		const wrapper = mount(HeaderNavbar, {
			global: {
				stubs: {
					Teleport: true,
					RouterLink: true,
				},
			},
			props: {
				items: [
					{ label: 'Accueil', to: '/' },
					{ label: 'À propos', to: '/about' },
				],
			},
			attachTo: document.body,
		})

		await wrapper.vm.$nextTick()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'HeaderNavigationBar – desktop horizontal', {
			ignoreRules: ['region'],
		})

		wrapper.unmount()
	})
})
