import CookieBanner from '../CookieBanner.vue'

describe('CookieBanner - Visual regression tests', () => {
	it('displays the cookie banner', () => {
		cy.mountWithVuetify(CookieBanner, {
			props: { modelValue: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('cookie-banner-default', cy.get('.v-application'))
	})

	it('displays the cookie banner with custom items', () => {
		cy.mountWithVuetify(CookieBanner, {
			props: {
				modelValue: true,
				items: {
					analytics: {
						title: 'Mesure d\'audience',
						description: 'Ces cookies permettent de mesurer la fréquentation du site.',
					},
				},
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('cookie-banner-with-items', cy.get('.v-application'))
	})
})
