import NotFoundPage from '../NotFoundPage.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('NotFoundPage - Visual regression tests', () => {
	it('displays the not found page by default', () => {
		cy.mountWithVuetify(NotFoundPage)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('not-found-page-default', cy.get('.v-application'))
	})

	it('displays the not found page without button', () => {
		cy.mountWithVuetify(NotFoundPage, {
			props: { hideBtn: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('not-found-page-no-btn', cy.get('.v-application'))
	})

	it('displays the not found page with custom button text', () => {
		cy.mountWithVuetify(NotFoundPage, {
			props: { btnText: 'Retour à l\'accueil' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('not-found-page-custom-btn', cy.get('.v-application'))
	})
})

describe('NotFoundPage - Focus visual regression tests', () => {
	// Bouton d'action (VBtn via StatusPage) : ring standard global (2px primary, offset 3px).
	it('shows the standard ring on the action button', () => {
		cy.mountWithVuetify(NotFoundPage, {
			props: { btnText: 'Retour à l\'accueil' },
		})

		focusVisible('.v-btn')
		cy.wait(100)
		cy.matchImageSnapshot('not-found-page-focus', cy.get('.v-application'))
	})
})
