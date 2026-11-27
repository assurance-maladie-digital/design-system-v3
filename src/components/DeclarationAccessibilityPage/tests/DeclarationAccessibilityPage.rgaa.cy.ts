import DeclarationAccessibilityPage from '../DeclarationAccessibilityPage.vue'

describe('DeclarationAccessibilityPage – RGAA browser checks – CNAM theme', () => {
	it('9.1 and 12.6 – exposes structured headings and contact information', () => {
		cy.mountWithVuetify(DeclarationAccessibilityPage, { props: { entityName: 'CNAM', siteName: 'Mon site', siteUrl: '/', contactEmail: 'accessibilite@example.fr' } })
		cy.get('h2').should('have.length.at.least', 1)
		cy.get('a[href="mailto:accessibilite@example.fr"]').should('be.visible')
	})
})
