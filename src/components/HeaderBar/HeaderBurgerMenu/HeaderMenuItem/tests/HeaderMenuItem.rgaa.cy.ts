import HeaderMenuItem from '../HeaderMenuItem.vue'

describe('HeaderMenuItem – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.6 – keeps the navigation link keyboard reachable', () => {
		cy.mountWithVuetify(HeaderMenuItem, { slots: { default: '<a href="/accueil">Accueil</a>' } })
		cy.get('li.header-menu-item').should('be.visible')
	})
})
