import BackBtn from '../BackBtn.vue'

describe('BackBtn - Visual regression tests', () => {
	it('displays the btn by default', () => {
		cy.mountWithVuetify(BackBtn)

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-default', cy.get('.v-btn'))
	})

	it('displays the btn without icon', () => {
		cy.mountWithVuetify(BackBtn, {
			props: { hideBackIcon: true },
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('back-btn-no-icon', cy.get('.v-btn'))
	})

	it('displays the btn in dark mode', () => {
		cy.mountWithVuetify(BackBtn, {
			props: {
				dark: true,
			},
		})
		cy.get('.v-application').invoke('css', 'background-color', '#121212')

		cy.get('.v-btn').should('be.visible')
		cy.get('.v-btn').matchImageSnapshot('back-btn-dark-mode', cy.get('.v-btn'))
		cy.get('.v-application').invoke('css', 'background-color', '')
	})

	it('displays the btn with custom background', () => {
		cy.mountWithVuetify(BackBtn, {
			props: { backgroundColor: '#f5f5f5' },
		})

		cy.get('.v-btn').should('be.visible')
		// cy.get('.v-btn').matchImageSnapshot('back-btn-custom-bg')
		// take a snapshot of the button and not the whole page to avoid snapshotting the background color of the page
		cy.matchImageSnapshot('back-btn-custom-bg', cy.get('.v-btn'))
	})
})

// Le ring de focus est en :focus-visible : on le déclenche via l'option
// native focus({ focusVisible: true }). On capture .v-application pour
// inclure l'outline (offset 3px hors de la boîte du bouton).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('BackBtn - Focus visual regression tests', () => {
	it('shows the primary focus ring on a light background', () => {
		cy.mountWithVuetify(BackBtn)

		focusVisible('.sy-back-btn')
		cy.wait(100)
		cy.matchImageSnapshot('back-btn-focus-light', cy.get('.v-application'))
	})

	it('shows the onPrimary focus ring in dark mode', () => {
		cy.mountWithVuetify(BackBtn, {
			props: { dark: true },
		})
		cy.get('.v-application').invoke('css', 'background-color', '#0c419a')

		focusVisible('.sy-back-btn')
		cy.wait(100)
		cy.matchImageSnapshot('back-btn-focus-dark', cy.get('.v-application'))
		cy.get('.v-application').invoke('css', 'background-color', '')
	})

	it('shows the focus ring when the VBtn renders as a link (href)', () => {
		cy.mountWithVuetify(BackBtn, {
			attrs: { href: '#retour' },
		})

		// VBtn rendu en <a> : couvert par .v-btn:focus-visible, pas par button:focus-visible
		cy.get('a.sy-back-btn').should('exist')
		focusVisible('a.sy-back-btn')
		cy.wait(100)
		cy.matchImageSnapshot('back-btn-focus-link', cy.get('.v-application'))
	})
})
