import SyNavList from '../SyNavList.vue'

describe('SyNavList – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.6 – exposes a labelled navigation with a keyboard reachable entry', () => {
		cy.mountWithVuetify(SyNavList, { props: { label: 'Dossiers', items: [{ id: 'home', label: 'Accueil', href: '/accueil' }] } })
		cy.get('nav[aria-label="Dossiers"]').should('be.visible')
		cy.get('a').contains('Accueil').should('be.visible').focus().should('have.focus')
	})
})
