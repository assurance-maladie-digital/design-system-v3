import HeaderMenuBtn from '../HeaderMenuBtn.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('HeaderMenuBtn - Focus visual regression tests', () => {
	// Bouton à fond primary : au focus, ring primary (visible sur fond clair grâce à
	// l'offset 3px), sans changement de couleur du bouton.
	it('shows the primary focus ring without changing the button colours', () => {
		cy.mountWithVuetify(HeaderMenuBtn)

		focusVisible('.header-menu-btn')
		cy.wait(100)
		cy.matchImageSnapshot('header-menu-btn-focus', cy.get('.v-application'))
	})
})
