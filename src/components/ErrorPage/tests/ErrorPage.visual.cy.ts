import ErrorPage from '../ErrorPage.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('ErrorPage - Visual regression tests', () => {
	it('displays the error page by default', () => {
		cy.mountWithVuetify(ErrorPage)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('error-page-default', cy.get('.v-application'))
	})

	it('displays the error page with custom message', () => {
		cy.mountWithVuetify(ErrorPage, {
			props: {
				pageTitle: 'Erreur technique',
				message: 'Une erreur inattendue s\'est produite.',
				code: '500',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('error-page-custom', cy.get('.v-application'))
	})

	it('displays the error page without button', () => {
		cy.mountWithVuetify(ErrorPage, {
			props: { hideBtn: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('error-page-no-btn', cy.get('.v-application'))
	})
})

describe('ErrorPage - Focus visual regression tests', () => {
	// Bouton d'action (VBtn via StatusPage) : ring standard global (2px primary, offset 3px).
	it('shows the standard ring on the action button', () => {
		cy.mountWithVuetify(ErrorPage, {
			props: { btnText: 'Retour à l\'accueil', btnHref: 'https://example.com' },
		})

		focusVisible('.v-btn')
		cy.wait(100)
		cy.matchImageSnapshot('error-page-focus', cy.get('.v-application'))
	})
})
