import FranceConnectBtn from '../FranceConnectBtn.vue'

describe('FranceConnectBtn - Visual regression tests', () => {
	it('displays the FranceConnect button by default', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: { href: 'https://franceconnect.gouv.fr' },
		})

		cy.get('.sy-france-connect-btn').should('be.visible')
		cy.matchImageSnapshot('france-connect-btn-default', cy.get('.sy-france-connect-btn'))
	})

	it('displays the FranceConnect+ button', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: {
				href: 'https://franceconnect.gouv.fr',
				isConnectPlus: true,
			},
		})

		cy.get('.sy-france-connect-btn').should('be.visible')
		cy.matchImageSnapshot('france-connect-btn-plus', cy.get('.sy-france-connect-btn'))
	})

	it('displays the FranceConnect button in dark mode', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: {
				href: 'https://franceconnect.gouv.fr',
				dark: true,
			},
		})
		cy.get('.v-application').invoke('css', 'background-color', '#121212')

		cy.get('.sy-france-connect-btn').should('be.visible')
		cy.matchImageSnapshot('france-connect-btn-dark', cy.get('.sy-france-connect-btn'))
		cy.get('.v-application').invoke('css', 'background-color', '')
	})
})
