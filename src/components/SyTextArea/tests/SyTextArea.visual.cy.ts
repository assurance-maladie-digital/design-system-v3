import SyTextArea from '../SyTextArea.vue'

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
