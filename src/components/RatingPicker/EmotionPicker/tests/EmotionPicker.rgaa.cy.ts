import EmotionPicker from '../EmotionPicker.vue'

describe('EmotionPicker – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.1 – exposes labelled radio options reachable by keyboard', () => {
		cy.mountWithVuetify(EmotionPicker, { props: { label: 'Votre satisfaction' } })
		cy.get('legend').should('be.visible').and('contain', 'Votre satisfaction')
		cy.get('[role="radiogroup"] [role="radio"]').should('have.length', 3)
		cy.get('[role="radio"]').first().focus().should('have.focus')
	})
})
