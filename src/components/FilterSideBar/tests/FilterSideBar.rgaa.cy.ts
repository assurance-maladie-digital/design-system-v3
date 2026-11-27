import FilterSideBar from '../FilterSideBar.vue'

describe('FilterSideBar – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.9 – exposes the labelled filter trigger', () => {
		cy.mountWithVuetify(FilterSideBar, { props: { modelValue: [{ name: 'statut', title: 'Statut', value: ['actif'] }] } })
		cy.get('.sy-filters-side-bar').should('be.visible').find('button').first().should('contain.text', 'Filtres')
	})
})
