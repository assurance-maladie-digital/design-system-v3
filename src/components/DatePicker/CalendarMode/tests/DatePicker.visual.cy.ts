import DatePicker from '../DatePicker.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('DatePicker (CalendarMode) - Focus visual regression tests', () => {
	// Grille dense : le ring vient du global `_btns.scss` (2px primary) mais l'offset est
	// réduit à 1px pour ne pas déborder sur les cellules voisines. On ouvre le calendrier
	// (le champ est l'activateur du VMenu) puis on focus une cellule de jour.
	it('shows the ring on a focused calendar day cell', () => {
		cy.mountWithVuetify(DatePicker, {
			props: { label: 'Date' },
		})

		// Ouvre le calendrier
		cy.get('.v-field').first().click()
		cy.get('.v-date-picker-month__day .v-btn', { timeout: 8000 }).should('be.visible')

		// Focus une cellule de jour
		focusVisible('.v-date-picker-month__day .v-btn')
		cy.wait(150)
		cy.matchImageSnapshot('date-picker-calendar-day-focus', cy.get('.v-application'))
	})

	// Bouton « Aujourd'hui » : ring standard global (offset 3px, bouton autonome).
	it('shows the ring on the today button', () => {
		cy.mountWithVuetify(DatePicker, {
			props: { label: 'Date' },
		})

		cy.get('.v-field').first().click()
		cy.get('.date-picker__today-button', { timeout: 8000 }).should('be.visible')

		focusVisible('.date-picker__today-button')
		cy.wait(150)
		cy.matchImageSnapshot('date-picker-today-button-focus', cy.get('.v-application'))
	})
})
