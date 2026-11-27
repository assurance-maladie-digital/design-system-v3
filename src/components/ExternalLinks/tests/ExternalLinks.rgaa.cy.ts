import ExternalLinks from '../ExternalLinks.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

describe('ExternalLinks – RGAA browser checks – CNAM theme', () => {
	const items = [{ text: 'Assurance Maladie', href: 'https://www.ameli.fr' }]

	it('3.2 – keeps sufficient contrast for the activator', () => {
		cy.mountWithVuetify(ExternalLinks, { props: { items, ariaLabel: 'Liens externes' } })
		cy.get('.sy-external-links-btn').trigger('mouseenter', { force: true })
		cy.get('.sy-external-links-btn-text').should(($text) => {
			expect(getTextContrast($text[0]!)).to.be.at.least(4.5)
		})
	})

	it('7.1 and 10.7 – opens the menu with a focusable link', () => {
		cy.mountWithVuetify(ExternalLinks, { props: { items, ariaLabel: 'Liens externes' } })
		cy.get('.sy-external-links-btn').click({ force: true })
		cy.get('.sy-external-links-list-item').should('be.visible').and('contain.text', 'Assurance Maladie')
	})
})
