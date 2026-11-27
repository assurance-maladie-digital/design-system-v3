import NumberPicker from '../NumberPicker.vue'

describe('NumberPicker – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.10 – exposes named numeric radio options', () => {
		cy.mountWithVuetify(NumberPicker, { props: { label: 'Note', length: 3 } })
		cy.get('legend').should('be.visible').and('contain', 'Note')
		cy.get('[role="radiogroup"] [role="radio"]').should('have.length', 3)
		cy.get('[role="radio"]').first().should('have.attr', 'aria-label')
		cy.get('[role="radio"]').first().focus().should('have.focus')
	})
})
