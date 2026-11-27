import SyNavListPanel from '../SyNavListPanel.vue'
import { locales } from '../locales'
describe('SyNavListPanel – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 12.1 – renders the active navigation link', () => {
		cy.mountWithVuetify(SyNavListPanel, { props: { items: [{ id: 'home', label: 'Accueil', href: '/', active: true }], locales, iconColor: 'primary', actionsVisibility: 'always' } })
		cy.get('.sy-nav-list-panel a').should('have.attr', 'aria-current', 'page').and('contain.text', 'Accueil')
	})
})
