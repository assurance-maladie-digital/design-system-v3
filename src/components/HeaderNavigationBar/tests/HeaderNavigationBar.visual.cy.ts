import HeaderNavigationBar from '../HeaderNavigationBar.vue'

const defaultItems = [
	{ label: 'Accueil', href: '/' },
	{ label: 'Mon compte', href: '/compte' },
	{ label: 'Mes remboursements', href: '/remboursements' },
]

describe('HeaderNavigationBar - Visual regression tests', () => {
	it('displays the navigation bar by default', () => {
		cy.mountWithVuetify(HeaderNavigationBar, {
			props: {
				serviceTitle: 'Ameli',
				items: defaultItems,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('header-navigation-bar-default', cy.get('.v-application'))
	})

	it('displays the navigation bar with subtitle', () => {
		cy.mountWithVuetify(HeaderNavigationBar, {
			props: {
				serviceTitle: 'Ameli',
				serviceSubtitle: 'Assurance Maladie',
				items: defaultItems,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('header-navigation-bar-subtitle', cy.get('.v-application'))
	})
})
