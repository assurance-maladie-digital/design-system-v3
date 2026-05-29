import SubHeader from '../SubHeader.vue'

describe('SubHeader - Visual regression tests', () => {
	it('displays the sub header by default', () => {
		cy.mountWithVuetify(SubHeader, {
			props: { titleText: 'Titre de la page' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sub-header-default', cy.get('.v-application'))
	})

	it('displays the sub header with subtitle', () => {
		cy.mountWithVuetify(SubHeader, {
			props: {
				titleText: 'Titre',
				subTitleText: 'Sous-titre',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sub-header-with-subtitle', cy.get('.v-application'))
	})

	it('displays the sub header without back button', () => {
		cy.mountWithVuetify(SubHeader, {
			props: {
				titleText: 'Titre',
				hideBackBtn: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sub-header-no-back-btn', cy.get('.v-application'))
	})

	it('displays the sub header in loading state', () => {
		cy.mountWithVuetify(SubHeader, {
			props: {
				titleText: 'Titre',
				loading: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('sub-header-loading', cy.get('.v-application'))
	})
})
