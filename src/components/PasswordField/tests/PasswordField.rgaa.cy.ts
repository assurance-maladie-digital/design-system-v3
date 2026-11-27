import PasswordField from '../PasswordField.vue'

describe('PasswordField – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – associates the password input with its label', () => {
		cy.mountWithVuetify(PasswordField, { props: { label: 'Mot de passe' } })
		cy.get('input[type="password"]').should('be.visible').and('have.attr', 'aria-label')
	})
})
