import SyCheckbox from '../SyCheckbox.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyCheckbox - Visual regression tests', () => {
	it('displays the checkbox unchecked by default', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: { label: 'J\'accepte les conditions' },
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-unchecked', cy.get('.v-checkbox'))
	})

	it('displays the checkbox checked', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'J\'accepte les conditions',
				modelValue: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-checked', cy.get('.v-checkbox'))
	})

	it('displays the checkbox in indeterminate state', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'Sélectionner tout',
				indeterminate: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-indeterminate', cy.get('.v-checkbox'))
	})

	it('displays the checkbox in disabled state', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'Option désactivée',
				disabled: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-disabled', cy.get('.v-checkbox'))
	})

	it('displays the checkbox as required', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'Champ obligatoire',
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-required', cy.get('.v-checkbox'))
	})

	// Ring DS au clavier : `.v-selection-control--focus-visible` (2px primary, offset 2px).
	it('shows the DS ring on the focused checkbox', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: { label: 'J\'accepte les conditions' },
		})

		focusVisible('.v-checkbox input[type="checkbox"]')
		cy.wait(150)
		cy.matchImageSnapshot('sy-checkbox-focus', cy.get('.v-checkbox'))
	})
})
