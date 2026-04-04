import Logo from '../Logo.vue'

describe('Logo - Visual regression tests', () => {
	it('displays the logo by default', () => {
		cy.mountWithVuetify(Logo)

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-default')
	})

	it('displays the logo without signature', () => {
		cy.mountWithVuetify(Logo, {
			props: { hideSignature: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-no-signature')
	})

	it('displays the logo without organism', () => {
		cy.mountWithVuetify(Logo, {
			props: { hideOrganism: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-no-organism')
	})

	it('displays the logo with occupational risk variant', () => {
		cy.mountWithVuetify(Logo, {
			props: { risquePro: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-risque-pro')
	})

	it('displays the logo in dark mode', () => {
		cy.get('body').invoke('css', 'background-color', '#121212')
		cy.mountWithVuetify(Logo, {
			props: { dark: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-dark')
		cy.get('body').invoke('css', 'background-color', '')
	})

	it('displays the logo as avatar', () => {
		cy.mountWithVuetify(Logo, {
			props: { avatar: true },
		})

		cy.get('svg').should('be.visible')
		cy.matchImageSnapshot('logo-avatar')
	})
})
