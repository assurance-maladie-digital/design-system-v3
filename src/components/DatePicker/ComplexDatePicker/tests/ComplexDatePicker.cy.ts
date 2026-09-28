import ComplexDatePicker from '../ComplexDatePicker.vue'

const overlayTransitionOptions = {
	global: {
		stubs: {
			'transition': false,
			'transition-group': false,
		},
	},
} as const

describe('ComplexDatePicker - Cypress interactions', () => {
	it('opens the combined calendar dialog from the input keyboard interaction', () => {
		cy.mountWithVuetify(ComplexDatePicker, {
			...overlayTransitionOptions,
			props: {
				label: 'Date de rendez-vous',
				format: 'DD/MM/YYYY',
			},
		})

		cy.get('.v-text-field input')
			.focus()
			.trigger('keydown', { key: 'Enter' })
		cy.get('[role="dialog"]').should('be.visible')
		cy.get('.date-picker-overlay-content').filter(':visible').should('have.length', 1)
	})

	it('opens on the selected custom-period month without prepending trailing disabled days', () => {
		cy.mountWithVuetify(ComplexDatePicker, {
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

		cy.get('.v-input__prepend').first().click()
		cy.get('.date-picker-overlay-content').filter(':visible').should('have.length', 1)
		cy.get('.v-date-picker-month__days .v-date-picker-month__day').then(($cells) => {
			const firstWeekTexts = Array.from($cells)
				.slice(7, 14)
				.map(cell => cell.textContent?.trim() ?? '')

			expect(firstWeekTexts).to.deep.equal(['28', '29', '30', '1', '2', '3', '4'])
		})
	})

	it('does not open the combined dialog when readonly', () => {
		cy.mountWithVuetify(ComplexDatePicker, {
			props: {
				label: 'Date de création',
				format: 'DD/MM/YYYY',
				modelValue: '01/01/2025',
				readonly: true,
			},
		})

		cy.get('.v-text-field input').type('{enter}', { force: true })
		cy.get('[role="dialog"]').should('not.exist')
	})
})
