import SyTextArea from '../SyTextArea.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyTextArea - Visual regression tests', () => {
	it('displays the textarea by default', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: { label: 'Description' },
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-default', cy.get('.v-textarea'))
	})

	it('displays the textarea as required', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				required: true,
			},
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-required', cy.get('.v-textarea'))
	})

	it('displays the textarea with a value', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				modelValue: 'Ceci est un texte de description.',
			},
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-with-value', cy.get('.v-textarea'))
	})

	it('displays the textarea with a custom variant', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				variant: 'filled',
			},
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-filled', cy.get('.v-textarea'))
	})
})

describe('SyTextArea - Focus visual regression tests', () => {
	// Bouton d'effacement (<button> natif) : ring standard global (2px primary, offset 3px).
	// Capture `.v-application` : le bouton est un sibling du textarea, et le ring est outset.
	it('shows the ring on the clear button', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				clearable: true,
				modelValue: 'Ceci est un texte de description.',
			},
		})

		focusVisible('.sy-textarea__clear-button')
		cy.wait(100)
		cy.matchImageSnapshot('sy-textarea-focus-clear', cy.get('.v-application'))
	})
})
