import CookiesSelection from '../CookiesSelection.vue'

const items = {
	functional: [{ name: 'display', description: 'Préférences d’affichage', conservation: '1 an' }],
	analytics: [{ name: 'visit', description: 'Mesure d’audience', conservation: '6 mois' }],
}

describe('CookiesSelection – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 9.1 – exposes headings, details and preference groups', () => {
		cy.mountWithVuetify(CookiesSelection, { props: { items } })
		cy.get('.vd-cookies-card').should('be.visible')
		cy.get('h2').should('have.length', 2)
		cy.get('details > summary').should('have.length', 2)
		cy.get('[data-test-id="radio-group"]').should('have.length', 2)
	})

	it('7.1, 7.3 and 11.10 – exposes labelled required choices and a submit button', () => {
		cy.mountWithVuetify(CookiesSelection, { props: { items } })
		cy.get('input[type="radio"]').should('have.length.greaterThan', 1)
		cy.get('[aria-required="true"]').should('have.length.greaterThan', 0)
		cy.get('[data-test-id="submit"]').should('be.visible').and('contain.text', 'Enregistrer')
	})

	it('10.7 and 12.8 – exposes a visible focus target for the details summary and submit action', () => {
		cy.mountWithVuetify(CookiesSelection, { props: { items } })
		cy.get('details > summary').first().then(($summary) => {
			($summary[0] as HTMLElement).focus()
			expect(document.activeElement).to.equal($summary[0])
		})
		cy.get('[data-test-id="submit"]').focus().should('be.focused')
	})
})
