import Pagination from '../Pagination.vue'
import { ref } from 'vue'
describe('Pagination – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.1 – renders page navigation controls', () => {
		cy.mountWithVuetify(Pagination, { global: { provide: { [Symbol.for('vuetify:data-table-pagination')]: { page: ref(1), itemsPerPage: ref(10), startIndex: ref(0), stopIndex: ref(10), pageCount: ref(2), itemsLength: ref(20), setItemsPerPage: () => {} } } } })
		cy.get('.v-data-table-footer__pagination').should('exist')
		cy.get('.v-pagination button').should('exist')
	})
})
