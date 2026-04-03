import HeaderBar from '../HeaderBar.vue'

describe('HeaderBar - Tests de non-régression visuelle', () => {
	it('affiche le header par défaut', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-default')
	})

	it('affiche le header avec un titre et un sous-titre', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
				serviceSubtitle: 'Description du service',
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-with-subtitle')
	})

	it('affiche le header avec une largeur personnalisée', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
				width: '900px',
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-custom-width')
	})

	it('affiche le header avec un slot header-side', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
			},
			slots: {
				'header-side': '<button>Connexion</button>',
			},
		})

		cy.get('.header').should('be.visible')
		cy.get('.header-side').should('be.visible')
		cy.matchImageSnapshot('header-bar-with-side')
	})

	it('affiche le header avec un slot prepend', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
			},
			slots: {
				prepend: '<div style="background:#005AA1;color:#fff;padding:4px 16px;font-size:14px;">Bandeau info</div>',
			},
		})

		cy.get('.header').should('be.visible')
		cy.get('.header-prepend').should('be.visible')
		cy.matchImageSnapshot('header-bar-with-prepend')
	})

	it('affiche le header non sticky', () => {
		cy.mountWithVuetify(HeaderBar, {
			props: {
				serviceTitle: 'Mon Service',
				sticky: false,
			},
		})

		cy.get('.header').should('be.visible')
		cy.matchImageSnapshot('header-bar-no-sticky')
	})
})
