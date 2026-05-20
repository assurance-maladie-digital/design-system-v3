import PhoneField from '../PhoneField.vue'

describe('PhoneField - Visual regression tests', () => {
	it('displays the phone field by default', () => {
		cy.mountWithVuetify(PhoneField)

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('phone-field-default', cy.get('.v-application'))
	})

	it('displays the phone field with country code selector', () => {
		cy.mountWithVuetify(PhoneField, {
			props: { withCountryCode: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('phone-field-with-country-code', cy.get('.v-application'))
	})

	it('displays the phone field with a value', () => {
		cy.mountWithVuetify(PhoneField, {
			props: { modelValue: '0612345678' },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('phone-field-with-value', cy.get('.v-application'))
	})
})
