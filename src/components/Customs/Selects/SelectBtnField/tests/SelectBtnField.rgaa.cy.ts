import SelectBtnField from '../SelectBtnField.vue'

describe('SelectBtnField – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 10.1 – exposes a labelled listbox trigger', () => {
		cy.mountWithVuetify(SelectBtnField, { props: { label: 'Moyen de contact', items: [{ title: 'Email', value: 'email' }] } })
		cy.get('[role="listbox"], button').first().should('be.visible').and($el => expect($el.attr('aria-label') || $el.attr('aria-labelledby')).to.exist)
	})
})
