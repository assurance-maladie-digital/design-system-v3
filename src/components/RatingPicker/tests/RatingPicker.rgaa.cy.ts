import RatingPicker from '../RatingPicker.vue'

describe('RatingPicker – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.9 – exposes keyboard reachable rating options', () => {
		cy.mountWithVuetify(RatingPicker, { props: { type: 'stars', label: 'Évaluation' } })
		cy.get('[role="radiogroup"], [role="group"]').should('be.visible')
		cy.get('[role="radio"], [tabindex="0"]').should('have.length.greaterThan', 0)
	})
})
