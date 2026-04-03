import Logo from '../Logo.vue'

describe('Logo - Tests de non-régression visuelle', () => {
	it('affiche le logo par défaut', () => {
		cy.mountWithVuetify(Logo)

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-default')
	})

	it('affiche le logo sans la signature', () => {
		cy.mountWithVuetify(Logo, {
			props: { hideSignature: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-no-signature')
	})

	it('affiche le logo sans organisme', () => {
		cy.mountWithVuetify(Logo, {
			props: { hideOrganism: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-no-organism')
	})

	it('affiche le logo en variante risque professionnel', () => {
		cy.mountWithVuetify(Logo, {
			props: { risquePro: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-risque-pro')
	})

	it('affiche le logo en mode sombre', () => {
		cy.mountWithVuetify(Logo, {
			props: { dark: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-dark')
	})

	it('affiche le logo en avatar', () => {
		cy.mountWithVuetify(Logo, {
			props: { avatar: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-avatar')
	})
})
