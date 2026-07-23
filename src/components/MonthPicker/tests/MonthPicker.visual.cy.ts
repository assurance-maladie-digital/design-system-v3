import MonthPicker from '../MonthPicker.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('MonthPicker - Visual regression tests', () => {
	it('displays the month picker by default', () => {
		cy.mountWithVuetify(MonthPicker)

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-default', cy.get('.v-text-field'))
	})

	it('displays the month picker with a value', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { modelValue: '03/2025' },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-with-value', cy.get('.v-text-field'))
	})

	it('displays the month picker in disabled state', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { disabled: true },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-disabled', cy.get('.v-text-field'))
	})

	it('displays the month picker in readonly state', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { readonly: true },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('month-picker-readonly', cy.get('.v-text-field'))
	})

	// Bouton d'ouverture (`<button>` natif) : ring DS primary scopé (2px, offset 2px).
	it('shows the DS ring on the focused toggle button', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { label: 'Mois', modelValue: '03/2025' },
		})

		focusVisible('.month-picker-input__toggle-btn')
		cy.wait(150)
		cy.matchImageSnapshot('month-picker-toggle-focus', cy.get('.v-text-field'))
	})

	// Bouton de la grille des mois : ring DS primary (`:focus-visible`, 2px). On ouvre le
	// picker puis on focus le mois actif (roving tabindex).
	it('shows the DS ring on a focused month grid button', () => {
		cy.mountWithVuetify(MonthPicker, {
			props: { label: 'Mois', modelValue: '03/2025' },
		})

		cy.get('.month-picker-input__toggle-btn').click()
		cy.get('.month-selector__month--active', { timeout: 8000 }).should('be.visible')

		focusVisible('.month-selector__month--active')
		cy.wait(150)
		cy.matchImageSnapshot('month-picker-month-focus', cy.get('.v-application'))
	})
})
