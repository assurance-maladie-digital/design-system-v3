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
