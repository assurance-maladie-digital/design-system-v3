// @vitest-environment jsdom

import { describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import HeaderBar from '../HeaderBar.vue'

// Scénario d’accessibilité : en-tête sticky avec logo et slots principaux.

vi.mock('@/utils/functions/throttleDisplayFn/throttleDisplayFn.ts', () => ({
	default: (fn: (...args: unknown[]) => void) => fn,
}))

describe('HeaderBar – accessibility (axe)', () => {
	async function checkA11y(
		name: string,
		options: Parameters<typeof mount<typeof HeaderBar>>[1] = {},
	) {
		const wrapper = mount(HeaderBar, {
			...options,
			attachTo: document.body,
		})

		try {
			const results = await axe(wrapper.element as HTMLElement)
			assertNoA11yViolations(results, `HeaderBar – ${name}`, { ignoreRules: ['region'] })
		}
		finally {
			wrapper.unmount()
		}
	}

	it('has no accessibility violations with sticky header and logo', async () => {
		await checkA11y('sticky with logo', {
			props: {
				headingLevelTitle: 1,
				sticky: true,
				serviceTitle: 'Synapse',
				serviceSubtitle: 'Design System',
			},
		})
	})

	it('has no accessibility violations with default props', async () => {
		await checkA11y('default')
	})

	it('has no accessibility violations with the main slots', async () => {
		await checkA11y('main slots', {
			slots: {
				'prepend': '<a href="/accueil">Accueil</a>',
				'menu': `
<button type="button" aria-label="Ouvrir le menu">
	Menu
	</button>
		`,
				'append': '<a href="/aide">Aide</a>',
				'header-side': `
	<button type="button">Mon compte</button>
	`,
			},
		})
	})

	it('has no accessibility violations with a custom logo slot', async () => {
		await checkA11y('custom logo', {
			slots: { logo: `<a href="/" aria-label="Accueil">Logo</a>` } })
	})

	it('has no accessibility violations with a custom brand content slot', async () => {
		await checkA11y('custom brand content', {
			props: {
				serviceTitle: 'Synapse',
				serviceSubtitle: 'Design System',
			},
			slots: { 'logo-brand-content': `<span>Informations complémentaires</span>` },
		})
	})

	it('has no accessibility violations with a header side link', async () => {
		await checkA11y('header side link', {
			slots: { 'header-side': `<a href="/profil">Mon profil</a>` },
		})
	})
})
