import Logo from '../Logo.vue'

describe('Logo - Visual regression tests', () => {
	it('displays the logo by default', () => {
		cy.mountWithVuetify(Logo)

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-default', cy.get('svg'))
	})

	it('displays the logo without signature', () => {
		cy.mountWithVuetify(Logo, {
			props: { hideSignature: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-no-signature', cy.get('svg'))
	})

	it('displays the logo without organism', () => {
		cy.mountWithVuetify(Logo, {
			props: { hideOrganism: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-no-organism', cy.get('svg'))
	})

	it('displays the logo with occupational risk variant', () => {
		cy.mountWithVuetify(Logo, {
			props: { risquePro: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-risque-pro', cy.get('svg'))
	})

	it('displays the logo in dark mode', () => {
		cy.mountWithVuetify(Logo, {
			props: { dark: true },
		})
		cy.get('.v-application').invoke('css', 'background-color', '#121212')

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-dark', cy.get('svg'))
		cy.get('.v-application').invoke('css', 'background-color', '')
	})

	it('displays the logo as avatar', () => {
		cy.mountWithVuetify(Logo, {
			props: { avatar: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-avatar', cy.get('svg'))
	})
})
