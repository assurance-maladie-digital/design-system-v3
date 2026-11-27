import FilterInline from '../FilterInline.vue'

describe('FilterInline – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 11.10 – exposes a visible keyboard reachable filter control', () => {
		cy.mountWithVuetify(FilterInline, { props: { modelValue: [{ name: 'status', title: 'Statut' }] } })
		cy.get('button.sy-filter-status').should('be.visible').and('contain', 'Statut').focus().should('have.focus')
	})
})
