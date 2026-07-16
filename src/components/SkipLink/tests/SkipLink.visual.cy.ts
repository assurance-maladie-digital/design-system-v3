import SkipLink from '../SkipLink.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SkipLink - Visual regression tests', () => {
	it('displays the skip link when focused', () => {
		cy.mountWithVuetify(SkipLink, {
			props: {
				label: 'Aller au contenu principal',
				target: '#main',
			},
		})

		// :focus-visible requis pour afficher le ring DS (barre visible via sr-only-focusable).
		focusVisible('.sy-skip-link')
		cy.get('.sy-skip-link').should('be.visible')
		cy.matchImageSnapshot('skip-link-focused', cy.get('.v-application'))
	})
})
