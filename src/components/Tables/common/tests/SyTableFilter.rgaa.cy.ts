import { h } from 'vue'
import SyTableFilter from '../SyTableFilter.vue'

describe('SyTableFilter – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 11.1 – exposes the custom filter label and input', () => {
		cy.mountWithVuetify(SyTableFilter, {
			props: { header: { title: 'Statut', key: 'status', filterType: 'custom' } },
			slots: { 'custom-filter': () => h('div', [h('label', { for: 'status-filter' }, 'Statut'), h('input', { id: 'status-filter', type: 'text' })]) },
		})
		cy.get('input#status-filter').should('be.visible').and('have.attr', 'id', 'status-filter')
		cy.get('label[for="status-filter"]').should('contain.text', 'Statut')
	})
})
