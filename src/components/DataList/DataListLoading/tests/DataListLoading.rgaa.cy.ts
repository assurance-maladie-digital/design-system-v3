import DataListLoading from '../DataListLoading.vue'
describe('DataListLoading – RGAA browser checks – CNAM theme', () => {
	it('1.2 – keeps the loading skeleton hidden from assistive technologies', () => {
		cy.mountWithVuetify(DataListLoading, { props: { itemsNumber: 3, heading: true } })
		cy.get('.sy-data-list-loading').should('be.visible').and('have.attr', 'aria-hidden', 'true')
	})
})
