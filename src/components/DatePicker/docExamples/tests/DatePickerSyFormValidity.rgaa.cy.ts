import Example from '../DatePickerSyFormValidity.vue'
describe('DatePickerSyFormValidity – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.2 and 11.1 – renders status and submit controls', () => {
		cy.mountWithVuetify(Example, { props: { mode: 'calendar' } })
		cy.get('form').should('exist')
		cy.get('[role="status"]').should('contain.text', 'Validité du SyForm')
		cy.get('button[type="submit"]').should('contain.text', 'Soumettre')
	})
})
