import PeriodField from '../PeriodField.vue'

describe('PeriodField – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 11.1 – exposes two labelled date inputs in a named group', () => {
		cy.mountWithVuetify(PeriodField, { props: { placeholderFrom: 'Début', placeholderTo: 'Fin' } })
		cy.get('[role="group"]').should('be.visible').and('have.attr', 'aria-label', 'Début - Fin')
		cy.get('input').should('have.length.at.least', 2)
		cy.contains('label', 'Début').should('be.visible')
		cy.contains('label', 'Fin').should('be.visible')
	})
})
