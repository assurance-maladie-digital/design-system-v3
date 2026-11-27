import DataListGroup from '../DataListGroup.vue'

describe('DataListGroup – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 9.1 – exposes grouped definitions with their labels', () => {
		cy.mountWithVuetify(DataListGroup, { props: { items: [{ title: 'Identité', items: [{ key: 'Nom', value: 'Dupont' }] }] } })
		cy.get('.v-application').should('be.visible').contains('Nom').should('be.visible')
		cy.get('dt, [role="term"]').should('have.length.greaterThan', 0)
	})
})
