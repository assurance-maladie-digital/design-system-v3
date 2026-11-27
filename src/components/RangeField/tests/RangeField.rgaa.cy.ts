import RangeField from '../RangeField.vue'

describe('RangeField – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 9.1 – exposes a labelled range fieldset and keyboard inputs', () => {
		cy.mountWithVuetify(RangeField, { props: { fieldsetLabel: 'Montant', textFieldMinLabel: 'Minimum', textFieldMaxLabel: 'Maximum' } })
		cy.get('fieldset legend').should('be.visible').and('contain', 'Montant')
		cy.get('input').should('have.length.at.least', 2)
		cy.get('input').eq(0).should('have.attr', 'aria-label', 'Minimum')
		cy.get('input').eq(1).should('have.attr', 'aria-label', 'Maximum')
	})
})
