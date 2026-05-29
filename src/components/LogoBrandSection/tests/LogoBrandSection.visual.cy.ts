import LogoBrandSection from '../LogoBrandSection.vue'

describe('LogoBrandSection - Visual regression tests', () => {
	it('displays the brand section by default', () => {
		cy.mountWithVuetify(LogoBrandSection)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-default', cy.get('.v-application'))
	})

	it('displays the brand section with service title', () => {
		cy.mountWithVuetify(LogoBrandSection, {
			props: {
				serviceTitle: 'Ameli',
				serviceSubTitle: 'Assurance Maladie',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-with-title', cy.get('.v-application'))
	})

	it('displays the brand section in mobile version', () => {
		cy.mountWithVuetify(LogoBrandSection, {
			props: {
				serviceTitle: 'Ameli',
				mobileVersion: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-mobile', cy.get('.v-application'))
	})

	it('displays the brand section with reduced logo', () => {
		cy.mountWithVuetify(LogoBrandSection, {
			props: { reduceLogo: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-reduced', cy.get('.v-application'))
	})
})
