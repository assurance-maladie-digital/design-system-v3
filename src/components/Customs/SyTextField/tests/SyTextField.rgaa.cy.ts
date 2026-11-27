import SyTextField from '../SyTextField.vue'

describe('SyTextField – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – exposes a labelled text input', () => {
		cy.mountWithVuetify(SyTextField, { props: { label: 'Nom' } })
		cy.get('input').should('be.visible').and('have.attr', 'aria-label')
	})
})
