import SyTextArea from '../SyTextArea.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyTextArea - Visual regression tests', () => {
	// Viewport réduit : le champ prend toute la largeur du viewport.
	beforeEach(() => {
		cy.viewport(400, 250)
	})

	it('displays the textarea by default', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: { label: 'Description' },
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-default', cy.get('.v-textarea'), { padding: 10 })
	})

	it('displays the textarea as required', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				required: true,
			},
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-required', cy.get('.v-textarea'), { padding: 10 })
	})

	it('displays the textarea with a value', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				modelValue: 'Ceci est un texte de description.',
			},
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-with-value', cy.get('.v-textarea'), { padding: 10 })
	})

	it('displays the textarea with a custom variant', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				variant: 'filled',
			},
		})

		cy.get('.v-textarea').should('be.visible')
		cy.matchImageSnapshot('sy-textarea-filled', cy.get('.v-textarea'), { padding: 10 })
	})
})

describe('SyTextArea - Focus visual regression tests', () => {
	// Viewport réduit : le textarea prend toute la largeur.
	beforeEach(() => {
		cy.viewport(400, 250)
	})

	// Bouton d'effacement (<button> natif) : ring standard global (2px primary, offset 3px).
	// La racine `.sy-textarea` contient le textarea et le bouton (absolu à 12px des
	// bords) : le ring outset reste dans sa boîte, la capture peut donc être serrée.
	it('shows the ring on the clear button', () => {
		cy.mountWithVuetify(SyTextArea, {
			props: {
				label: 'Description',
				clearable: true,
				modelValue: 'Ceci est un texte de description.',
			},
		})

		focusVisible('.sy-textarea__clear-button')
		cy.matchImageSnapshot('sy-textarea-focus-clear', cy.get('.sy-textarea'), { padding: 10 })
	})
})
