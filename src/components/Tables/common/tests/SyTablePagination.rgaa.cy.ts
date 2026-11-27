import SyTablePagination from '../SyTablePagination.vue'

describe('SyTablePagination – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 12.6 – exposes labelled pagination controls', () => {
		cy.mountWithVuetify(SyTablePagination, {
			props: { page: 2, pageCount: 4, itemsPerPage: 10, itemsLength: 40, pageInput: true },
		})
		cy.get('input[role="combobox"]').should('be.visible').invoke('attr', 'aria-label').should('match', /^Lignes par page:?$/)
		cy.get('input.page-input__field').should('be.visible').and('have.attr', 'aria-label').and('contain', '4')
	})
})
