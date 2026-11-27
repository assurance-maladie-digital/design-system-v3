import CookiesInformation from '../CookiesInformation.vue'

const cookies = [{
	name: 'session',
	description: 'Sauvegarde la session.',
	conservation: '20 heures',
}]

describe('CookiesInformation – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 11.1 – exposes a labelled details disclosure and cookie choice', () => {
		cy.mountWithVuetify(CookiesInformation, {
			props: { type: 'functional', tableItems: cookies },
		})

		cy.get('h2').should('contain.text', 'Cookies fonctionnels')
		cy.get('summary').should('be.visible').and('contain.text', 'Afficher les cookies')
		cy.get('[data-test-id="radio-group"]').should('exist')
		cy.get('input[type="radio"]').should('have.length', 2)
	})

	it('8.2 – reveals the cookie table through the native details control', () => {
		cy.mountWithVuetify(CookiesInformation, {
			props: { type: 'functional', tableItems: cookies },
		})

		cy.get('summary').click()
		cy.get('details[open]').should('exist')
		cy.get('table').should('be.visible')
	})
})
