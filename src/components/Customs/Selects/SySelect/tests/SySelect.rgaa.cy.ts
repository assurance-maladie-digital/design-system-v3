import SySelect from '../SySelect.vue'

describe('SySelect – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – exposes a labelled combobox', () => {
		cy.mountWithVuetify(SySelect, { props: { label: 'Civilité', items: [{ title: 'Madame', value: 'mme' }] } })
		cy.get('[role="combobox"], input').should('be.visible').and($el => expect($el.attr('aria-label') || $el.attr('aria-labelledby')).to.exist)
	})
})
