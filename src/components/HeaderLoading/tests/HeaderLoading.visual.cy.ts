import HeaderLoading from '../HeaderLoading.vue'

describe('HeaderLoading - Visual regression tests', () => {
	it('displays the inline skeleton loader', () => {
		cy.mountWithVuetify(HeaderLoading)

		cy.get('.v-skeleton-loader').should('be.visible')
		cy.matchImageSnapshot('header-loading-default', cy.get('.v-skeleton-loader'))
	})

	it('displays the standalone loader with aria role', () => {
		cy.mountWithVuetify(HeaderLoading, {
			props: {
				standalone: true,
				ariaLabel: 'Chargement des données...',
			},
		})

		cy.get('[role="alert"]').should('exist')
		cy.matchImageSnapshot('header-loading-standalone', cy.get('.v-application'))
	})

	it('displays the loader with custom dimensions', () => {
		cy.mountWithVuetify(HeaderLoading, {
			props: {
				width: '200px',
				height: '2rem',
			},
		})

		cy.get('.v-skeleton-loader').should('be.visible')
		cy.matchImageSnapshot('header-loading-custom-size', cy.get('.v-skeleton-loader'))
	})
})
