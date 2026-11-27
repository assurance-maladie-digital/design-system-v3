import SyIconAccessibility from '../SyIconAccessibility.vue'

describe('SyIconAccessibility – RGAA browser checks – CNAM theme', () => {
	it('1.2 and 1.3 – presents the accessible icon guidance and a labelled preview', () => {
		cy.mountWithVuetify(SyIconAccessibility)
		cy.contains('Principes d\'accessibilité').should('be.visible')
		cy.contains('Icônes décoratives').should('be.visible')
		cy.contains('Icônes informatives').should('be.visible')
		cy.get('.v-icon').should('have.attr', 'aria-hidden', 'true')
	})
})
