import PasswordField from '../PasswordField.vue'

describe('PasswordField – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 11.10 – exposes a labelled password input and visibility control', () => {
		cy.mountWithVuetify(PasswordField, { props: { label: 'Mot de passe' } })
		cy.get('input[type="password"]').should('be.visible').should('have.attr', 'aria-label', 'Mot de passe')
		cy.get('.password-toggle-button').should('be.visible').should('have.attr', 'aria-controls')
		cy.get('.password-toggle-button').should('have.attr', 'aria-pressed')
	})
})
