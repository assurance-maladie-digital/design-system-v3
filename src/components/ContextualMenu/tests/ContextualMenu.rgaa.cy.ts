import ContextualMenu from '../ContextualMenu.vue'

describe('ContextualMenu – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 9.2 – exposes a labelled navigation landmark', () => {
		cy.mountWithVuetify(ContextualMenu, { props: { ariaLabel: 'Menu de navigation', items: [{ text: 'Accueil', hash: '#accueil', level: 1 }] } })
		cy.get('nav').should('have.attr', 'aria-label', 'Menu de navigation')
	})
})
