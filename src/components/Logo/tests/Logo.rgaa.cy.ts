import Logo from '../Logo.vue'

describe('Logo – RGAA browser checks – CNAM theme', () => {
	it('1.2 – exposes a meaningful accessible name for the brand image', () => {
		cy.mountWithVuetify(Logo)
		cy.get('svg, img').should('be.visible').and($logo => expect($logo.attr('aria-label') || $logo.attr('alt') || $logo.attr('role')).to.exist)
	})
})
