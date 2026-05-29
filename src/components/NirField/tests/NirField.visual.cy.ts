import NirField from '../NirField.vue'

describe('NirField - Visual regression tests', () => {
	it('displays the NIR field by default', () => {
		cy.mountWithVuetify(NirField)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-default', cy.get('.v-application'))
	})

	it('displays the NIR field with key display', () => {
		cy.mountWithVuetify(NirField, {
			props: { displayKey: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-with-key', cy.get('.v-application'))
	})

	it('displays the NIR field in complex mode', () => {
		cy.mountWithVuetify(NirField, {
			props: { nirType: 'complexe' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-complex', cy.get('.v-application'))
	})
})
