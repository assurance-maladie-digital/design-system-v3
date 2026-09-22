import ExternalLinks from '../ExternalLinks.vue'

const defaultItems = [
	{ text: 'Ameli.fr', href: 'https://www.ameli.fr' },
	{ text: 'Service-public.fr', href: 'https://www.service-public.fr' },
]

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('ExternalLinks - Visual regression tests', () => {
	it('displays the external links button', () => {
		cy.mountWithVuetify(ExternalLinks, {
			props: { items: defaultItems },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('external-links-default', cy.get('.v-application'))
	})

	it('displays the external links in fixed position', () => {
		cy.mountWithVuetify(ExternalLinks, {
			props: {
				items: defaultItems,
				fixed: true,
				position: 'bottom right',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('external-links-fixed', cy.get('.v-application'))
	})
})

describe('ExternalLinks - Focus visual regression tests', () => {
	// Activateur : fond primary → ring on-primary (blanc) inset au focus.
	it('shows the onPrimary ring on the activator tab', () => {
		cy.mountWithVuetify(ExternalLinks, {
			props: { items: defaultItems },
		})

		focusVisible('.sy-external-links-btn')
		cy.wait(100)
		cy.matchImageSnapshot('external-links-focus-btn', cy.get('.v-application'))
	})

	// Item de liste : fond blanc → ring primary inset au focus.
	it('shows the primary ring on a focused list item', () => {
		cy.mountWithVuetify(ExternalLinks, {
			props: { items: defaultItems },
		})

		// L'onglet est translaté en partie hors-viewport (seuls ~48px dépassent) : son
		// centre n'est pas actionnable → force le clic pour ouvrir le menu.
		cy.get('.sy-external-links-btn').click({ force: true })
		cy.get('.sy-external-links-list-item').should('be.visible')
		focusVisible('.sy-external-links-list-item')
		cy.wait(100)
		cy.matchImageSnapshot('external-links-focus-item', cy.get('.v-application'))
	})
})
