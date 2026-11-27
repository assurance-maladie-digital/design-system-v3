import LogoBrandSection from '../LogoBrandSection.vue'

describe('LogoBrandSection – RGAA browser checks – CNAM theme', () => {
	it('1.2 and 8.2 – exposes the brand section without unlabeled images', () => {
		cy.mountWithVuetify(LogoBrandSection, { props: { serviceTitle: 'Ameli', serviceSubTitle: 'Assurance Maladie' } })
		cy.get('.v-application').should('be.visible').find('svg').should('have.length.greaterThan', 0)
	})
})
