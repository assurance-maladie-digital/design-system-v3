import HeaderSubMenu from '../HeaderSubMenu.vue'
import { registerSubMenuKey } from '../../conts'
describe('HeaderSubMenu – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – toggles the named submenu with the keyboard', () => {
		cy.mountWithVuetify(HeaderSubMenu, { slots: { title: 'Menu', default: '<a href="/item">Item</a>' }, global: { provide: { [registerSubMenuKey as symbol]: () => {} } } })
		cy.get('.sub-menu-btn').focus().type('{enter}')
		cy.get('.sub-menu-btn').should('have.attr', 'aria-expanded', 'true')
		cy.get('[role="group"]').should('have.attr', 'aria-labelledby')
	})
})
