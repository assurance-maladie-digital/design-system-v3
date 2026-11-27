import FooterBar from '../FooterBar.vue'

describe('FooterBar – RGAA browser checks – CNAM theme', () => {
	it('9.3 – exposes a footer landmark with readable content', () => {
		cy.mountWithVuetify(FooterBar)
		cy.get('footer, .v-footer').should('be.visible').and('contain.text', 'Mentions légales')
	})
})
