import StarsPicker from '../StarsPicker.vue'

describe('StarsPicker – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.1 – exposes labelled star options reachable by keyboard', () => {
		cy.mountWithVuetify(StarsPicker, { props: { label: 'Évaluation', length: 5 } })
		cy.get('legend').should('be.visible').and('contain', 'Évaluation')
		cy.get('[role="radiogroup"] [role="radio"]').should('have.length', 5)
		cy.get('[role="radio"]').first().focus().should('have.focus')
	})
})
