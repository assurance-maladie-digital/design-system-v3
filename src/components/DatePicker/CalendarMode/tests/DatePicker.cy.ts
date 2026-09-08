import DatePicker from '../DatePicker.vue'

const overlayTransitionOptions = {
	global: {
		stubs: {
			'transition': false,
			'transition-group': false,
		},
	},
} as const

describe('DatePicker - Cypress interactions', () => {
	it('opens the calendar dialog when the input is clicked', () => {
		cy.mountWithVuetify(DatePicker, {
			...overlayTransitionOptions,
			props: {
				label: 'Date de rendez-vous',
				format: 'DD/MM/YYYY',
			},
		})

		cy.get('.date-picker-container input').click()
		cy.get('[role="dialog"][aria-modal="true"]').should('be.visible')
		cy.get('.date-picker-overlay-content').filter(':visible').should('have.length', 1)
	})

	it('opens on the selected custom-period month without prepending trailing disabled days', () => {
		cy.mountWithVuetify(DatePicker, {
			...overlayTransitionOptions,
			props: {
				label: 'Date de rendez-vous',
				format: 'DD/MM/YYYY',
				modelValue: '15/12/2005',
				period: {
					min: '01/01/1995',
					max: '12/31/2005',
				},
			},
		})

		cy.get('.date-picker-container input').click()
		cy.get('.date-picker-overlay-content').filter(':visible').should('have.length', 1)
		cy.get('.v-date-picker-month__days .v-date-picker-month__day').then(($cells) => {
			const firstWeekTexts = Array.from($cells)
				.slice(7, 14)
				.map(cell => cell.textContent?.trim() ?? '')

			expect(firstWeekTexts).to.deep.equal(['28', '29', '30', '1', '2', '3', '4'])
		})
	})

	it('opens the calendar dialog when Enter is pressed on the input', () => {
		cy.mountWithVuetify(DatePicker, {
			...overlayTransitionOptions,
			props: {
				label: 'Date de naissance',
				format: 'DD/MM/YYYY',
			},
		})

		cy.get('.date-picker-container input')
			.focus()
			.trigger('keydown', { key: 'Enter' })
		cy.get('[role="dialog"][aria-modal="true"]').should('be.visible')
		cy.get('.date-picker-overlay-content').filter(':visible').should('have.length', 1)
	})
})
