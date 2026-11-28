import BackToTopBtn from '../BackToTopBtn.vue'

function triggerScroll(scrollY = 200) {
	cy.window().then((win) => {
		Object.defineProperty(win, 'scrollY', { value: scrollY, writable: true })
		win.dispatchEvent(new Event('scroll'))
	})
}

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('BackToTopBtn - Visual regression tests', () => {
	it('displays the button after scroll', () => {
		cy.mountWithVuetify(BackToTopBtn, {
			props: { threshold: 0 },
		})

		triggerScroll()
		cy.get('.vd-back-to-top-btn').should('be.visible')
		cy.matchImageSnapshot('back-to-top-btn-default', cy.get('.vd-back-to-top-btn'))
	})

	it('displays the button with custom nudge', () => {
		cy.mountWithVuetify(BackToTopBtn, {
			props: {
				threshold: 0,
				nudgeRight: '32px',
				nudgeBottom: '32px',
			},
		})

		triggerScroll()
		cy.get('.vd-back-to-top-btn').should('be.visible')
		cy.matchImageSnapshot('back-to-top-btn-custom-nudge', cy.get('.vd-back-to-top-btn'))
	})
})

describe('BackToTopBtn - Focus visual regression tests', () => {
	// Ring standard fourni par l'override global (2px primary, offset 3px), dessiné
	// hors de la boîte du bouton : padding 10px autour de la capture élément.
	it('shows the standard ring on the button', () => {
		cy.viewport(960, 200)
		cy.mountWithVuetify(BackToTopBtn, {
			props: { threshold: 0 },
		})

		triggerScroll()
		cy.get('.vd-back-to-top-btn').should('be.visible')
		focusVisible('.vd-back-to-top-btn')
		cy.matchImageSnapshot('back-to-top-btn-focus', cy.get('.vd-back-to-top-btn'), { padding: 10 })
	})
})
