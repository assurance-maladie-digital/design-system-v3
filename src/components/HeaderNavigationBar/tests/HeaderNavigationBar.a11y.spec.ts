// @vitest-environment jsdom

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import HeaderNavigationBar from '../HeaderNavigationBar.vue'

const items = [
	{ label: 'Accueil', href: '/accueil' },
	{ label: 'À propos', href: '/a-propos' },
]

const runAxe = async (
	wrapper: ReturnType<typeof mount>,
	name: string,
) => {
	const results = await axe(wrapper.element as HTMLElement)

	assertNoA11yViolations(results, name, {
		ignoreRules: ['region'],
	})

	wrapper.unmount()
}

const mountComponent = (options = {}) =>
	mount(HeaderNavigationBar, {
		global: {
			stubs: {
				Teleport: true,
				RouterLink: true,
			},
		},
		...options,
	})

describe('HeaderNavigationBar – accessibility (axe)', () => {
	it('has no axe violations – default props', async () => {
		const wrapper = mountComponent({
			props: {
				items,
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – default props',
		)
	})

	it('has no axe violations – home accessibility', async () => {
		const wrapper = mountComponent({
			props: {
				items,
				homeAriaLabel: 'Retour à l’accueil',
				homeLink: {
					href: '/',
					ariaLabel: 'Retour à l’accueil',
				},
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – home accessibility',
		)
	})

	it('has no axe violations – service heading', async () => {
		const wrapper = mountComponent({
			props: {
				items,
				serviceTitle: 'Mon service',
				serviceSubtitle: 'Description du service',
				headingLevelTitle: 2,
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – service heading',
		)
	})

	it('has no axe violations – navigation items', async () => {
		const wrapper = mountComponent({
			props: {
				items: [
					{ label: 'Accueil', href: '/accueil' },
					{ label: 'Services', href: '/services' },
					{ label: 'Contact', href: '/contact' },
				],
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – navigation items',
		)
	})

	it('has no axe violations – disabled item', async () => {
		const wrapper = mountComponent({
			props: {
				items: [
					...items,
					{
						label: 'Indisponible',
						href: '/indisponible',
						disabled: true,
					},
				],
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – disabled item',
		)
	})

	it('has no axe violations – header configuration', async () => {
		const wrapper = mountComponent({
			props: {
				items,
				sticky: false,
				hideWhenDown: true,
				width: '1200px',
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – header configuration',
		)
	})

	it('has no axe violations – vertical navigation configuration', async () => {
		const wrapper = mountComponent({
			props: {
				items,
				maxHorizontalMenuItems: 1,
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – vertical navigation',
		)
	})

	it('has no axe violations – slots', async () => {
		const wrapper = mountComponent({
			props: {
				items,
			},
			slots: {
				'logo': `
					<img
							src="/logo-msa.svg"
							alt="MSA : Santé, Famille, Retraite, Services"
							width="115px"
							height="52px"
						/>
				`,
				'logo-brand-content': `
					<span>Mon service</span>
				`,
				'header-side': `
					<button type="button">
						Mon compte
					</button>
				`,
				'navigation-bar-prepend': `
					<a href="/retour">
						Retour
					</a>
				`,
				'navigation-bar-append': `
					<button type="button">
						Aide
					</button>
				`,
				'navigation-bar-content': `
					<span>Navigation principale</span>
				`,
				'navigation-menu-prepend': `
					<span>Menu</span>
				`,
				'navigation-menu-append': `
					<button type="button">
						Fermer
					</button>
				`,
				'navigation-menu-content': `
					<span>Contenu du menu</span>
				`,
			},
		})

		await runAxe(
			wrapper,
			'HeaderNavigationBar – slots',
		)
	})
})
