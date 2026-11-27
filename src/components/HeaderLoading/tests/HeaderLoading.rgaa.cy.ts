import HeaderLoading from '../HeaderLoading.vue'

describe('HeaderLoading – RGAA browser checks – CNAM theme', () => {
	it('7.5 – announces standalone loading status', () => {
		cy.mountWithVuetify(HeaderLoading, { props: { standalone: true, ariaLabel: 'Chargement des données' } })
		cy.get('[role="alert"]').should('be.visible').and('have.attr', 'aria-label', 'Chargement des données')
	})
})
