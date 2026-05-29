import MonthPicker from '../MonthPicker.vue'

describe('MonthPicker - Visual regression tests', () => {
	it('displays the month picker by default', () => {
		cy.mountWithVuetify(MonthPicker)

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-default', cy.get('.v-text-field'))
	})

	it('displays the month picker with a value', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { modelValue: '03/2025' },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-with-value', cy.get('.v-text-field'))
	})

	it('displays the month picker in disabled state', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { disabled: true },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-disabled', cy.get('.v-text-field'))
	})

	it('displays the month picker in readonly state', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { readonly: true },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-readonly', cy.get('.v-text-field'))
	})
})
