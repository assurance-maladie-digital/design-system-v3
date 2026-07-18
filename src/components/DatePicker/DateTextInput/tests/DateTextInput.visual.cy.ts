import DateTextInput from '../DateTextInput.vue'

describe('DateTextInput - Visual regression tests', () => {
	it('displays the single date text field by default', () => {
		cy.mountWithVuetify(DateTextInput, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('date-text-input-default', cy.get('.v-text-field'))
	})

	it('displays the date range text field with a value', () => {
		cy.mountWithVuetify(DateTextInput, {
			props: {
				label: 'Période',
				format: 'DD/MM/YYYY',
				displayRange: true,
				modelValue: ['01/01/2025', '10/01/2025'],
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.get('.v-text-field input').click({ force: true }).should('be.focused')
		cy.matchImageSnapshot('date-text-input-range', cy.get('.v-text-field'))
	})

	it('displays the readonly date text field', () => {
		cy.mountWithVuetify(DateTextInput, {
			props: {
				label: 'Date de création',
				format: 'DD/MM/YYYY',
				modelValue: '01/01/2025',
				readonly: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.get('.v-text-field input').click({ force: true }).should('be.focused')
		cy.matchImageSnapshot('date-text-input-readonly', cy.get('.v-text-field'))
	})
})
