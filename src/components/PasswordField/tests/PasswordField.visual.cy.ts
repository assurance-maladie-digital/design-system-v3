import PasswordField from '../PasswordField.vue'

describe('PasswordField - Visual regression tests', () => {
	it('displays the password field by default', () => {
		cy.mountWithVuetify(PasswordField, {
			props: { label: 'Mot de passe' },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('password-field-default', cy.get('.v-text-field'))
	})

	it('displays the password field as required', () => {
		cy.mountWithVuetify(PasswordField, {
			props: {
				label: 'Mot de passe',
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('password-field-required', cy.get('.v-text-field'))
	})

	it('displays the password field in disabled state', () => {
		cy.mountWithVuetify(PasswordField, {
			props: {
				label: 'Mot de passe',
				disabled: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('password-field-disabled', cy.get('.v-text-field'))
	})

	it('displays the password field with underlined variant', () => {
		cy.mountWithVuetify(PasswordField, {
			props: {
				label: 'Mot de passe',
				variantStyle: 'underlined',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('password-field-underlined', cy.get('.v-text-field'))
	})
})
