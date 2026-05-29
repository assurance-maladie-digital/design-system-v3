import DeclarationAccessibilityPage from '../DeclarationAccessibilityPage.vue'

describe('DeclarationAccessibilityPage - Visual regression tests', () => {
	it('displays the declaration page with required props', () => {
		cy.mountWithVuetify(DeclarationAccessibilityPage, {
			props: {
				entityName: 'Assurance Maladie',
				siteName: 'Ameli',
				siteUrl: 'https://www.ameli.fr',
				contactEmail: 'accessibilite@assurance-maladie.fr',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('declaration-a11y-page-default', cy.get('.v-application'))
	})

	it('displays the declaration page with full information', () => {
		cy.mountWithVuetify(DeclarationAccessibilityPage, {
			props: {
				entityName: 'Assurance Maladie',
				siteName: 'Ameli',
				siteUrl: 'https://www.ameli.fr',
				contactEmail: 'accessibilite@assurance-maladie.fr',
				rgaaVersion: '4.1',
				overallComplianceRate: 85,
				declarationDate: '2024-01-01',
				technologies: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('declaration-a11y-page-full', cy.get('.v-application'))
	})
})
