import HeaderMenuSection from '../HeaderMenuSection.vue'

describe('HeaderMenuSection – RGAA browser checks – CNAM theme', () => {
	it('9.1 – exposes a named navigation section', () => {
		cy.mountWithVuetify(HeaderMenuSection, { props: { title: 'Navigation' }, slots: { default: '<li>Accueil</li>' } })
		cy.get('section[aria-labelledby]').should('be.visible')
		cy.get('h2').should('contain', 'Navigation')
	})
})
