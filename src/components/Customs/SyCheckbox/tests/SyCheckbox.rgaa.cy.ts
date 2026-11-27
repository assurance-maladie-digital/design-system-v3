import SyCheckbox from '../SyCheckbox.vue'

describe('SyCheckbox – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – exposes a labelled checkbox', () => {
		cy.mountWithVuetify(SyCheckbox, { props: { label: 'Recevoir les notifications' } })
		cy.get('input[type="checkbox"]').should('exist').then(($input) => {
			cy.get(`label[for="${$input.attr('id')}"]`).should('be.visible').and('contain', 'Recevoir les notifications')
		})
	})
})
