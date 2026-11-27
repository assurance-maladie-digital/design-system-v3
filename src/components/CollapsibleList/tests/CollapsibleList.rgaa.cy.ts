import CollapsibleList from '../CollapsibleList.vue'

describe('CollapsibleList – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.9 – exposes keyboard reachable links', () => {
		cy.mountWithVuetify(CollapsibleList, { props: { listTitle: 'Ressources', items: [{ text: 'Lien 1', href: '#lien1' }] } })
		cy.get('.vd-collapse-list').should('be.visible').find('a').first().should('have.attr', 'href')
	})
})
