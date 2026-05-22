import SyPagination from '../SyPagination.vue'

describe('SyPagination - Visual regression tests', () => {
	it('displays pagination on first page', () => {
		cy.mountWithVuetify(SyPagination, {
			props: {
				modelValue: 1,
				pages: 10,
			},
		})

		cy.get('.sy-pagination').should('be.visible')
		cy.matchImageSnapshot('sy-pagination-first-page', cy.get('.sy-pagination'))
	})

	it('displays pagination on middle page', () => {
		cy.mountWithVuetify(SyPagination, {
			props: {
				modelValue: 5,
				pages: 10,
			},
		})

		cy.get('.sy-pagination').should('be.visible')
		cy.matchImageSnapshot('sy-pagination-middle-page', cy.get('.sy-pagination'))
	})

	it('displays pagination with label', () => {
		cy.mountWithVuetify(SyPagination, {
			props: {
				modelValue: 1,
				pages: 5,
				label: 'Navigation des pages',
			},
		})

		cy.get('.sy-pagination').should('be.visible')
		cy.matchImageSnapshot('sy-pagination-with-label', cy.get('.sy-pagination'))
	})
})
