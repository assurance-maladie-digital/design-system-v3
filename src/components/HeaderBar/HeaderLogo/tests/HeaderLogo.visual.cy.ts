import HeaderLogo from '../HeaderLogo.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('HeaderLogo - Focus visual regression tests', () => {
	// Le lien logo n'est pas bord-à-bord (padding du .header-logo) : ring outset DS.
	// Viewport réduit : le lien prend toute la largeur du viewport.
	it('shows the focus ring on the logo link', () => {
		cy.viewport(400, 150)
		cy.mountWithVuetify(HeaderLogo, {
			props: { serviceTitle: 'Mon service' },
		})

		focusVisible('.logo')
		cy.matchImageSnapshot('header-logo-focus', cy.get('.logo'), { padding: 10 })
	})
})
