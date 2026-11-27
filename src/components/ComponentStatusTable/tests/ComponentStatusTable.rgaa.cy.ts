import ComponentStatusTable from '../ComponentStatusTable.vue'
describe('ComponentStatusTable – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 9.1 – renders the quality heading, search and tabular data', () => {
		cy.mountWithVuetify(ComponentStatusTable)
		cy.get('h1').should('contain.text', 'Qualité code')
		cy.get('table').should('have.length.at.least', 1)
		cy.get('input').should('exist')
	})
})
