import CookiesTable from '../CookiesTable.vue'

describe('CookiesTable – RGAA browser checks – CNAM theme', () => {
	it('9.1 and 11.1 – exposes column headers and cookie data in a table', () => {
		cy.mountWithVuetify(CookiesTable, {
			props: {
				items: [{
					name: 'session',
					description: 'Sauvegarde la session.',
					conservation: '20 heures',
				}],
			},
		})

		cy.get('table').should('be.visible')
		cy.get('thead th[scope="col"]').should('have.length', 3)
		cy.get('tbody tr').should('have.length', 1).and('contain.text', 'session')
	})
})
