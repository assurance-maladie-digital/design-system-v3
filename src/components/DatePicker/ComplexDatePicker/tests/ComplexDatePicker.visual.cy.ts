import ComplexDatePicker from '../ComplexDatePicker.vue'

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
	month: 'complex-date-picker-opened-days',
	months: 'complex-date-picker-opened-months',
	year: 'complex-date-picker-opened-years',
}

const activeElementSelectorByViewMode: Record<CalendarViewMode, string> = {
	month: '[data-v-date="2025-06-15"] button',
	months: '.v-date-picker-months .v-btn--active',
	year: '.v-date-picker-years .v-btn--active',
}

const freezeDate = () => {
	cy.clock(new Date(2025, 5, 15, 12).getTime(), ['Date'])
}

const openComplexDialogInView = (viewMode: CalendarViewMode) => {
	freezeDate()
	cy.mountWithVuetify(ComplexDatePicker, {
		props: fixedOverlayProps,
	}).then(async ({ wrapper }) => {
		const vm = wrapper.findComponent(ComplexDatePicker).vm as {
			openDatePicker: () => Promise<void> | void
			currentViewMode: CalendarViewMode
			$nextTick: () => Promise<void>
		}

		await vm.openDatePicker()
		await vm.$nextTick()
		vm.currentViewMode = viewMode
		await vm.$nextTick()
	})

	cy.get('.date-picker-overlay-content').filter(':visible').should('have.length', 1).as('visibleOverlay')
	cy.document({ log: false }).then((doc) => {
		if (doc.activeElement instanceof HTMLElement) {
			doc.activeElement.blur()
		}
	})
	cy.get(activeElementSelectorByViewMode[viewMode]).should('be.visible').focus().should('be.focused')
	cy.get(overlayPanelSelectorByViewMode[viewMode]).should('be.visible')
	cy.matchImageSnapshot(snapshotNameByViewMode[viewMode], cy.get('@visibleOverlay'))
}

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('ComplexDatePicker - Visual regression tests', () => {
	it('displays the combined date field by default', () => {
		cy.mountWithVuetify(ComplexDatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('complex-date-picker-default', cy.get('.v-text-field'))
	})

	it('displays the readonly combined date field without opening the dialog', () => {
		cy.mountWithVuetify(ComplexDatePicker, {
			props: {
				label: 'Date de création',
				format: 'DD/MM/YYYY',
				modelValue: '01/01/2025',
				readonly: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.get('.v-text-field input').type('{enter}', { force: true })
		cy.get('[role="dialog"]').should('not.exist')
		cy.matchImageSnapshot('complex-date-picker-readonly', cy.get('.v-text-field'))
	})

	it('displays the opened combined dialog in day view', () => {
		openComplexDialogInView('month')
	})

	it('displays the opened combined dialog in month view', () => {
		openComplexDialogInView('months')
	})

	it('displays the opened combined dialog in year view', () => {
		openComplexDialogInView('year')
	})
})

describe('ComplexDatePicker - Focus visual regression tests', () => {
	// Même migration que CalendarMode : ring global sur les `.v-btn` du calendrier, offset
	// annulé dans la grille dense. Contrairement au CalendarMode, le champ n'est pas
	// l'activateur (`textFieldActivator: false` par défaut) : le calendrier s'ouvre via
	// l'icône calendrier (prepend). On l'ouvre donc, puis on focus une cellule de jour.
	it('shows the ring on a focused calendar day cell', () => {
		freezeDate()
		cy.mountWithVuetify(ComplexDatePicker, {
			props: { label: 'Date' },
		})

		cy.get('.v-input__prepend').first().click()
		cy.get('.v-date-picker-month__day .v-btn').should('be.visible')

		focusVisible('.v-date-picker-month__day .v-btn')
		cy.get('.v-date-picker-month__day .v-btn').should('be.focused')
		cy.matchImageSnapshot('complex-date-picker-calendar-day-focus', cy.get('.v-application'))
	})
})
