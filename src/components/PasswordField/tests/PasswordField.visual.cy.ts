import PasswordField from '../PasswordField.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

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

	// Bouton toggle afficher/masquer (VBtn) : ring DS primary scopé (2px, offset 2px),
	// au lieu de l'ancien box-shadow bleu codé en dur.
	it('shows the DS ring on the focused visibility toggle', () => {
		cy.mountWithVuetify(PasswordField, {
			props: { label: 'Mot de passe' },
		})

		focusVisible('.password-toggle-button')
		cy.wait(150)
		cy.matchImageSnapshot('password-field-toggle-focus', cy.get('.v-text-field'))
	})

	// Bouton clear (<button> natif) : ring DS primary scopé (2px, offset 2px).
	it('shows the DS ring on the focused clear button', () => {
		cy.mountWithVuetify(PasswordField, {
			props: { label: 'Mot de passe', clearable: true, modelValue: 'secret' },
		})

		focusVisible('.password-clear-button')
		cy.wait(150)
		cy.matchImageSnapshot('password-field-clear-focus', cy.get('.v-text-field'))
	})
})
