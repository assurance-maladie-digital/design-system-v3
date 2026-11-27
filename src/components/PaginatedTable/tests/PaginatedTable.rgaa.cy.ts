import PaginatedTable from '../PaginatedTable.vue'

const headers = [{ title: 'Nom', key: 'name' }, { title: 'Âge', key: 'age' }]

describe('PaginatedTable – RGAA browser checks – CNAM theme', () => {
	it('9.1 and 11.1 – exposes the table caption and column headers', () => {
		cy.mountWithVuetify(PaginatedTable, {
			props: {
				suffix: 'rgaa-browser',
				caption: 'Liste des personnes',
				headers,
				items: [{ name: 'Ada', age: 36 }],
			},
		})

		cy.get('caption').should('contain.text', 'Liste des personnes')
		cy.get('th[scope="col"]').should('have.length.at.least', 2)
	})

	it('7.1 – keeps pagination buttons keyboard focusable', () => {
		cy.mountWithVuetify(PaginatedTable, {
			props: {
				suffix: 'rgaa-browser-pagination',
				caption: 'Liste paginée',
				headers,
				items: Array.from({ length: 12 }, (_, index) => ({ name: `Personne ${index}`, age: index })),
				itemsPerPage: 10,
			},
		})

		cy.get('.v-pagination button:not([disabled])').first().focus().should('be.focused')
	})
})
