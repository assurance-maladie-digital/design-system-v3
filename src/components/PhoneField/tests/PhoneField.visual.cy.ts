import PhoneField from '../PhoneField.vue'

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
})
