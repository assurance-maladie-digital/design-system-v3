import DatePickerLite from '../DatePickerLite.vue'

describe('DatePickerLite - Navigation integration', () => {
	it('navigates to January 2026 via the year and month selectors', () => {
		cy.window({ log: false }).then((win) => {
			Object.defineProperty(win.navigator, 'language', {
				value: 'fr-FR',
				configurable: true,
			})
		})

		cy.mountWithVuetify(DatePickerLite, {
			props: {
				label: 'Date de naissance',
				modelValue: new Date(2025, 5, 15),
			},
		})

		cy.get('.date-picker-lite-input__toggle-btn').click()
		cy.get('.date-picker-lite-menu').should('be.visible')

		cy.get('.visual-picker-year-btn').click()
		cy.get('.year-selector').should('be.visible')

		cy.get('.year-selector__year.year-2026').click()

		cy.get('.visual-picker-month-btn').click()
		cy.get('.month-selector').should('be.visible')

		cy.get('.month-selector__month.month-1').click()

		cy.document({ log: false }).then((doc) => {
			if (doc.activeElement instanceof HTMLElement) {
				doc.activeElement.blur()
			}
		})

		cy.get('table.sy-calendar').should('have.attr', 'aria-label', 'janvier 2026')
		cy.get('tbody[data-month="2026-01"]').should('exist')
		cy.get('.visual-picker-month-btn').should('contain.text', 'janv')
		cy.get('.visual-picker-year-btn').should('contain.text', '2026')

		cy.get('tbody[data-month="2026-01"] td[data-date^="2026-01"]')
			.should('have.length', 31)

		cy.get('tbody[data-month="2026-01"] tr')
			.first()
			.within(() => {
				cy.get('td')
					.eq(3)
					.should('have.attr', 'data-date', '2026-01-01')
			})

		cy.matchImageSnapshot('date-picker-lite-january-2026', cy.get('.date-picker-lite-menu'))
	})
})
