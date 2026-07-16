import CopyBtn from '../CopyBtn.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('CopyBtn - Visual regression tests', () => {
	it('displays the copy button by default', () => {
		cy.mountWithVuetify(CopyBtn, {
			props: { textToCopy: 'Texte à copier' },
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('copy-btn-default', cy.get('.v-btn'))
	})

	it('displays the copy button without tooltip', () => {
		cy.mountWithVuetify(CopyBtn, {
			props: {
				textToCopy: 'Texte à copier',
				hideTooltip: true,
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('copy-btn-no-tooltip', cy.get('.v-btn'))
	})
})

describe('CopyBtn - Focus visual regression tests', () => {
	// Ring standard fourni par l'override global (2px primary, offset 3px). Capture
	// `.v-application` pour ne pas rogner le ring outset.
	it('shows the standard ring on the button', () => {
		cy.mountWithVuetify(CopyBtn, {
			props: { textToCopy: 'Texte à copier' },
		})

		focusVisible('.v-btn')
		cy.wait(100)
		cy.matchImageSnapshot('copy-btn-focus', cy.get('.v-application'))
	})
})
