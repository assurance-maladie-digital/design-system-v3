import MonthPicker from '../MonthPicker.vue'
describe('MonthPicker – RGAA browser checks – CNAM theme', () => {
	it('11.1 and 13.3 – exposes the labelled month field and picker control', () => {
		cy.mountWithVuetify(MonthPicker, { props: { label: 'Mois de début' } })
		cy.get('input').should('have.attr', 'aria-label').and('contain', 'Mois de début')
		cy.get('button[aria-label="Ouvrir le sélecteur de mois"]').should('be.visible')
	})
})
