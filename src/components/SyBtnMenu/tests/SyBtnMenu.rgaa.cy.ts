import SyBtnMenu from '../SyBtnMenu.vue'

describe('SyBtnMenu – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.9 – exposes a labelled menu button', () => {
		cy.mountWithVuetify(SyBtnMenu, { props: { primaryInfo: 'Jean Dupont', secondaryInfo: 'Administrateur' } })
		cy.get('.sy-user-menu-btn').should('be.visible').and('have.attr', 'aria-haspopup')
	})
})
