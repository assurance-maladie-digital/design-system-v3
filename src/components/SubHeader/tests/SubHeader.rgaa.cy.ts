import SubHeader from '../SubHeader.vue'

describe('SubHeader – RGAA browser checks – CNAM theme', () => {
	it('8.2 – exposes the page title as a heading', () => {
		cy.mountWithVuetify(SubHeader, { props: { titleText: 'Titre de la page' } })
		cy.get('h1, h2, h3, h4, h5, h6').should('contain', 'Titre de la page')
	})
})
