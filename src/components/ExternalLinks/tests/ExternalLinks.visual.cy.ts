import ExternalLinks from '../ExternalLinks.vue'

const defaultItems = [
	{ text: 'Ameli.fr', href: 'https://www.ameli.fr' },
	{ text: 'Service-public.fr', href: 'https://www.service-public.fr' },
]

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
