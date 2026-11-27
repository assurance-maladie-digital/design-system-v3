import DiacriticPicker from '../DiacriticPicker.vue'

describe('DiacriticPicker – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.10 – exposes a labelled dialog trigger', () => {
		cy.mountWithVuetify(DiacriticPicker)
		cy.get('button.sy-diacritic-btn').should('be.visible').and('have.attr', 'aria-haspopup', 'dialog').and('have.attr', 'aria-controls')
		cy.get('button.sy-diacritic-btn').focus().should('have.focus')
	})
})
