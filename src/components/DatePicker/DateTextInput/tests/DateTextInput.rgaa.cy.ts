import DateTextInput from '../DateTextInput.vue'
describe('DateTextInput – RGAA browser checks – CNAM theme', () => {
	it('11.1 and 13.3 – renders the required labelled date field', () => {
		cy.mountWithVuetify(DateTextInput, { props: { label: 'Date de naissance', format: 'DD/MM/YYYY', required: true } })
		cy.get('input').should('have.attr', 'aria-label').and('contain', 'Date de naissance')
		cy.get('input').should('have.attr', 'aria-required', 'true')
	})
})
