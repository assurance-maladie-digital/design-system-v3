import HorizontalNavbar from '../HorizontalNavbar.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultItems = [
	{ label: 'Accueil', href: '#' },
	{ label: 'Mon compte', href: '#' },
	{ label: 'Mes remboursements', href: '#' },
]

describe('HorizontalNavbar - Visual regression tests', () => {
	it('displays the navbar by default', () => {
		cy.mountWithVuetify(HorizontalNavbar, {
			props: { items: defaultItems },
		})

		cy.get('.horizontal-menu').should('be.visible')
		cy.matchImageSnapshot('horizontal-navbar-default', cy.get('.v-application'))
	})

	// Le focus des onglets vient de SyTabs (ring 2px inset, couleur active-color = blanc ici).
	it('shows the focus ring on a tab', () => {
		cy.mountWithVuetify(HorizontalNavbar, {
			props: { items: defaultItems },
		})

		focusVisible('.sy-tabs__button')
		cy.wait(100)
		cy.matchImageSnapshot('horizontal-navbar-focus-tab', cy.get('.v-application'))
	})
})
