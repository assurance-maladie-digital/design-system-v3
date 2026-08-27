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

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SubHeader - Focus visual regression tests', () => {
	// Fond primary : le back button a un ring on-primary (blanc), visible sur le bleu.
	it('shows the onPrimary focus ring on the back button', () => {
		cy.mountWithVuetify(SubHeader, {
			props: { titleText: 'Titre de la page' },
		})

		focusVisible('.vd-sub-header-back-btn')
		cy.wait(100)
		cy.matchImageSnapshot('sub-header-focus-back-btn', cy.get('.v-application'))
	})
})
