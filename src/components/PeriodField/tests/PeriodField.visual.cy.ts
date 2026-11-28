import PeriodField from '../PeriodField.vue'

describe('PeriodField - Visual regression tests', () => {
	// Viewport réduit : le champ prend toute la largeur du viewport.
	beforeEach(() => {
		cy.viewport(450, 150)
	})

	it('displays the period field by default', () => {
		cy.mountWithVuetify(PeriodField)

		cy.get('.period-field').should('be.visible')
		cy.matchImageSnapshot('period-field-default', cy.get('.period-field'), { padding: 10 })
	})

	it('displays the period field with a value', () => {
		cy.mountWithVuetify(PeriodField, {
			props: {
				modelValue: { from: '01/01/2025', to: '31/12/2025' },
			},
		})

		cy.get('.period-field').should('be.visible')
		cy.matchImageSnapshot('period-field-with-value', cy.get('.period-field'), { padding: 10 })
	})

	it('displays the period field in no calendar mode', () => {
		cy.mountWithVuetify(PeriodField, {
			props: { noCalendar: true },
		})

		cy.get('.period-field').should('be.visible')
		cy.matchImageSnapshot('period-field-no-calendar', cy.get('.period-field'), { padding: 10 })
	})

	it('displays the period field as required', () => {
		cy.mountWithVuetify(PeriodField, {
			props: { required: true },
		})

		cy.get('.period-field').should('be.visible')
		cy.matchImageSnapshot('period-field-required', cy.get('.period-field'), { padding: 10 })
	})
})
