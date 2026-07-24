import DatePicker from '../DatePicker.vue'

type CalendarViewMode = 'month' | 'months' | 'year'

const fixedOverlayProps = {
	label: 'Date de rendez-vous',
	format: 'DD/MM/YYYY',
	modelValue: '15/06/2025',
} as const

const overlayPanelSelectorByViewMode: Record<CalendarViewMode, string> = {
	month: '.v-date-picker-month',
	months: '.v-date-picker-months',
	year: '.v-date-picker-years',
}

const snapshotNameByViewMode: Record<CalendarViewMode, string> = {
	month: 'date-picker-calendar-opened-days',
	months: 'date-picker-calendar-opened-months',
	year: 'date-picker-calendar-opened-years',
}

const activeElementSelectorByViewMode: Record<CalendarViewMode, string> = {
	month: '[data-v-date="2025-06-15"] button',
	months: '.v-date-picker-months .v-btn--active',
	year: '.v-date-picker-years .v-btn--active',
}

const openCalendarModeDialogInView = (viewMode: CalendarViewMode) => {
	cy.mountWithVuetify(DatePicker, {
		props: fixedOverlayProps,
	}).then(async ({ wrapper }) => {
		const vm = wrapper.findComponent(DatePicker).vm as {
			openDatePicker: () => Promise<void> | void
			currentViewMode: CalendarViewMode
			$nextTick: () => Promise<void>
		}

		await vm.openDatePicker()
		await vm.$nextTick()
		vm.currentViewMode = viewMode
		await vm.$nextTick()
	})

	cy.wait(250, { log: false })
	cy.document({ log: false }).then((doc) => {
		if (doc.activeElement instanceof HTMLElement) {
			doc.activeElement.blur()
		}
	})
	cy.get(activeElementSelectorByViewMode[viewMode]).should('be.visible').focus()
	cy.get('.date-picker-overlay-content').filter(':visible').should('have.length', 1).as('visibleOverlay')
	cy.get(overlayPanelSelectorByViewMode[viewMode]).should('be.visible')
	cy.matchImageSnapshot(snapshotNameByViewMode[viewMode], cy.get('@visibleOverlay'))
}

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('DatePicker - Visual regression tests', () => {
	it('displays the calendar mode field by default', () => {
		cy.mountWithVuetify(DatePicker, {
			props: {
				label: 'Date de naissance',
				format: 'DD/MM/YYYY',
			},
		})

		cy.get('.date-picker-container').should('be.visible')
		cy.matchImageSnapshot('date-picker-calendar-default', cy.get('.date-picker-container'))
	})

	it('displays the readonly calendar field without opening the dialog', () => {
		cy.mountWithVuetify(DatePicker, {
			props: {
				label: 'Date de création',
				format: 'DD/MM/YYYY',
				modelValue: '01/01/2025',
				readonly: true,
			},
		})

		cy.get('.date-picker-container').should('be.visible')
		cy.get('.date-picker-container input').click({ force: true })
		cy.get('[role="dialog"]').should('not.exist')
		cy.matchImageSnapshot('date-picker-calendar-readonly', cy.get('.date-picker-container'))
	})

	it('displays the opened calendar dialog in day view', () => {
		openCalendarModeDialogInView('month')
	})

	it('displays the opened calendar dialog in month view', () => {
		openCalendarModeDialogInView('months')
	})

	it('displays the opened calendar dialog in year view', () => {
		openCalendarModeDialogInView('year')
	})
})

describe('DatePicker (CalendarMode) - Focus visual regression tests', () => {
	// Grille dense : le ring vient du global `_btns.scss` (2px primary) mais l'offset est
	// réduit à 1px pour ne pas déborder sur les cellules voisines. On ouvre le calendrier
	// (le champ est l'activateur du VMenu) puis on focus une cellule de jour.
	it('shows the ring on a focused calendar day cell', () => {
		cy.mountWithVuetify(DatePicker, {
			props: { label: 'Date' },
		})

		cy.get('.v-field').first().click()
		cy.get('.v-date-picker-month__day .v-btn', { timeout: 8000 }).should('be.visible')

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
