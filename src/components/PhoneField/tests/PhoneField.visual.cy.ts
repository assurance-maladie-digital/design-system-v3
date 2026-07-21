import PhoneField from '../PhoneField.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('PhoneField - Visual regression tests', () => {
	it('displays the phone field by default', () => {
		cy.mountWithVuetify(PhoneField)

		cy.get('.phone-field-container').should('be.visible')
		cy.matchImageSnapshot('phone-field-default', cy.get('.phone-field-container'))
	})

	it('displays the phone field with country code selector', () => {
		cy.mountWithVuetify(PhoneField, {
			props: { withCountryCode: true },
		})

		cy.get('.phone-field-container').should('be.visible')
		cy.matchImageSnapshot('phone-field-with-country-code', cy.get('.phone-field-container'))
	})

	it('displays the phone field with a value', () => {
		cy.mountWithVuetify(PhoneField, {
			props: { modelValue: '0612345678' },
		})

		cy.get('.phone-field-container').should('be.visible')
		cy.matchImageSnapshot('phone-field-with-value', cy.get('.phone-field-container'))
	})

	// Bouton clear (`<button>` natif) : ring DS primary scopé (2px, offset 1px).
	it('shows the DS ring on the focused clear button', () => {
		cy.mountWithVuetify(PhoneField, {
			props: { isClearable: true, modelValue: '0612345678' },
		})

		focusVisible('.phone-field__clear-button')
		cy.wait(150)
		cy.matchImageSnapshot('phone-field-clear-focus', cy.get('.phone-field-container'))
	})
})
