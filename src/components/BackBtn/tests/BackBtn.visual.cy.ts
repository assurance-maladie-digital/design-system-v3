import BackBtn from '../BackBtn.vue'

describe('BackBtn - Tests de non-régression visuelle', () => {
	it('affiche le bouton retour par défaut', () => {
		cy.mountWithVuetify(BackBtn)

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-default')
	})

	it('affiche le bouton retour sans icône', () => {
		cy.mountWithVuetify(BackBtn, {
			props: { hideBackIcon: true },
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-no-icon')
	})

	it('affiche le bouton retour en mode sombre', () => {
		// Forcer un background sombre pour s'assurer que le bouton est bien visible

		cy.mountWithVuetify(BackBtn, {
			props: {
				dark: true,
				backgroundColor: '#333333',
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-dark-mode')
	})

	it('affiche le bouton retour avec un fond personnalisé', () => {
		cy.mountWithVuetify(BackBtn, {
			props: { backgroundColor: '#f5f5f5' },
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-custom-bg')
	})
})
