import PhoneFieldResetFixture from './PhoneField.reset.fixture.vue'

describe('PhoneField reset @reset', () => {
	it('clears displayed validation errors after submit then reset', () => {
		cy.mountWithVuetify(PhoneFieldResetFixture)

		cy.contains('button', 'Envoyer').click()
		cy.get('.phone-field').should('have.class', 'error-field')
		cy.get('input[type="tel"]').should('have.attr', 'aria-invalid', 'true')

		cy.contains('button', 'Réinitialiser').click()

		cy.get('.phone-field').should('not.have.class', 'error-field')
		cy.get('input[type="tel"]').should('not.have.attr', 'aria-invalid')
		cy.get('.v-messages__message').should('not.exist')
	})
})
