import SkipLink from '../SkipLink.vue'

describe('SkipLink – RGAA browser checks – CNAM theme', () => {
	it('12.7 – provides a keyboard skip link to the main content', () => {
		cy.mountWithVuetify(SkipLink, { props: { label: 'Aller au contenu principal', target: '#main' } })
		cy.get('.sy-skip-link').should('have.attr', 'href', '#main').focus().should('be.visible')
	})
})
