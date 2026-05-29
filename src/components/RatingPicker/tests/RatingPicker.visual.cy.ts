import RatingPicker from '../RatingPicker.vue'

describe('RatingPicker - Visual regression tests', () => {
	it('displays the stars rating picker', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: {
				type: 'stars',
				label: 'Évaluation',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-stars', cy.get('.v-application'))
	})

	it('displays the number rating picker', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: {
				type: 'number',
				label: 'Satisfaction',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-number', cy.get('.v-application'))
	})

	it('displays the emotion rating picker', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: {
				type: 'emotion',
				label: 'Ressenti',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-emotion', cy.get('.v-application'))
	})

	it('displays the rating picker in readonly mode', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: {
				type: 'stars',
				label: 'Évaluation',
				readonly: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-readonly', cy.get('.v-application'))
	})
})
