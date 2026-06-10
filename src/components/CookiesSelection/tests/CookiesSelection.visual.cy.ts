import CookiesSelection from '../CookiesSelection.vue'

describe('CookiesSelection - Visual regression tests', () => {
	it('displays cookies selection with items', () => {
		cy.mountWithVuetify(CookiesSelection, {
			props: {
				items: {
					analytics: [
						{ name: 'Matomo', description: 'Mesure d\'audience', conservation: '13 mois' },
					],
					functional: [
						{ name: 'Préférences', description: 'Sauvegarde les préférences utilisateur', conservation: '12 mois' },
					],
				},
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('cookies-selection-default', cy.get('.v-application'))
	})
})
