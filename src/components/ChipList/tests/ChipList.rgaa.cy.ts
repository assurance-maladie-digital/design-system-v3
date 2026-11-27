import ChipList from '../ChipList.vue'

describe('ChipList – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 10.1 – renders labelled chips without positive tabindex', () => {
		cy.mountWithVuetify(ChipList, { props: { items: [{ value: 'a', text: 'Option A' }, { value: 'b', text: 'Option B' }] } })
		cy.get('.sy-chip-list').should('be.visible').find('.v-chip').should('have.length', 2)
		cy.get('.remove-chip').should('have.length.greaterThan', 0)
		cy.get('.sy-chip-list').then(($root) => {
			const positiveTabindexes = Array.from($root.find('[tabindex]')).filter(element => Number(element.getAttribute('tabindex')) > 0)
			expect(positiveTabindexes).to.have.length(0)
		})
	})
})
