import HeaderLogo from '../HeaderLogo.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('HeaderLogo - Focus visual regression tests', () => {
	// Le lien logo n'est pas bord-à-bord (padding du .header-logo) : ring outset DS.
	it('shows the focus ring on the logo link', () => {
		cy.mountWithVuetify(HeaderLogo, {
			props: { serviceTitle: 'Mon service' },
		})

		focusVisible('.logo')
		cy.wait(100)
		cy.matchImageSnapshot('header-logo-focus', cy.get('.v-application'))
	})
})
