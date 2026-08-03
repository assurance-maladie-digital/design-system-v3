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
