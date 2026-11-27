import SyTextArea from '../SyTextArea.vue'

describe('SyTextArea – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 11.1 – exposes a labelled keyboard reachable textarea', () => {
		cy.mountWithVuetify(SyTextArea, { props: { uniqueId: 'description', label: 'Description' } })
		cy.get('textarea#description').should('be.visible').and('have.attr', 'aria-label', 'Description').focus().should('have.focus')
	})

	it('7.1 and 11.10 – exposes an accessible clear action', () => {
		cy.mountWithVuetify(SyTextArea, { props: { modelValue: 'Texte', label: 'Description', clearable: true } })
		cy.get('button[aria-label]').should('be.visible').and('have.attr', 'type', 'button')
	})
})
