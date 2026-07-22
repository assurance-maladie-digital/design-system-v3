import ComplexDatePicker from '../ComplexDatePicker.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('ComplexDatePicker - Focus visual regression tests', () => {
	// Même migration que CalendarMode : ring global sur les `.v-btn` du calendrier, offset
	// annulé dans la grille dense. Contrairement au CalendarMode, le champ n'est pas
	// l'activateur (`textFieldActivator: false` par défaut) : le calendrier s'ouvre via
	// l'icône calendrier (prepend). On l'ouvre donc, puis on focus une cellule de jour.
	it('shows the ring on a focused calendar day cell', () => {
		cy.mountWithVuetify(ComplexDatePicker, {
			props: { label: 'Date' },
		})

		cy.get('.v-input__prepend').first().click()
		cy.get('.v-date-picker-month__day .v-btn', { timeout: 8000 }).should('be.visible')

		focusVisible('.v-date-picker-month__day .v-btn')
		cy.wait(150)
		cy.matchImageSnapshot('complex-date-picker-calendar-day-focus', cy.get('.v-application'))
	})
})
