import HeaderToolbar from '../HeaderToolbar.vue'

describe('HeaderToolbar - Visual regression tests', () => {
	// Viewport 960px : plancher desktop (sous smAndDown le menu droit bascule
	// en version mobile), la barre suit la largeur du viewport.
	beforeEach(() => {
		cy.viewport(960, 100)
	})

	it('displays the toolbar with default menu items', () => {
		cy.mountWithVuetify(HeaderToolbar)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('header-toolbar-default', cy.get('.toolbar'))
	})

	it('displays the toolbar with custom left menu', () => {
		cy.mountWithVuetify(HeaderToolbar, {
			props: {
				leftMenu: [
					{ title: 'Assuré', href: 'https://www.ameli.fr/assure', openInNewTab: true },
					{ title: 'Professionnel de santé', href: 'https://www.ameli.fr/pro' },
				],
				currentPageIndex: 0,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('header-toolbar-custom', cy.get('.toolbar'))
	})
})
