import BackBtn from '../BackBtn.vue'

describe('BackBtn - Visual regression tests', () => {
	it('displays the btn by default', () => {
		cy.mountWithVuetify(BackBtn)

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-default')
	})

	it('displays the btn without icon', () => {
		cy.mountWithVuetify(BackBtn, {
			props: { hideBackIcon: true },
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-no-icon')
	})

	it('displays the btn in dark mode', () => {
		cy.get('body').invoke('css', 'background-color', '#121212')
		cy.mountWithVuetify(BackBtn, {
			props: {
				dark: true,
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-dark-mode')
		cy.get('body').invoke('css', 'background-color', '')
	})

	it('displays the btn with custom background', () => {
		cy.mountWithVuetify(BackBtn, {
			props: { backgroundColor: '#f5f5f5' },
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-custom-bg')
	})
})
