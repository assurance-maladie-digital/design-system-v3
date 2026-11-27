import CookieBanner from '../CookieBanner.vue'

describe('CookieBanner – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 9.1 – exposes a named dialog with consent controls', () => {
		cy.mountWithVuetify(CookieBanner, { props: { modelValue: true } })
		cy.get('.vd-cookie-banner__inner[role="dialog"]').should('be.visible').and('have.attr', 'aria-label')
		cy.get('.vd-cookie-banner__inner button').should('have.length.greaterThan', 0)
	})
})
