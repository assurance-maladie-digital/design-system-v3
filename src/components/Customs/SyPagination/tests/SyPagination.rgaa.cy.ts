import SyPagination from '../SyPagination.vue'

describe('SyPagination – RGAA browser checks – CNAM theme', () => {
	it('7.1, 8.9 and 12.6 – exposes labelled pagination controls and current page', () => {
		cy.mountWithVuetify(SyPagination, { props: { modelValue: 2, pages: 5, label: 'Résultats' } })
		cy.get('nav.pagination').should('be.visible').and('have.attr', 'aria-labelledby')
		cy.get('[aria-current="page"]').should('contain', '2')
		cy.get('.previous-page, .next-page').should('have.length', 2)
	})
})
