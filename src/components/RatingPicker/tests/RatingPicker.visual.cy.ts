import RatingPicker from '../RatingPicker.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('RatingPicker - Visual regression tests', () => {
	it('displays the stars rating picker', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: { type: 'stars', label: 'Évaluation' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-stars', cy.get('.v-application'))
	})

	it('displays the number rating picker', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: { type: 'number', label: 'Satisfaction' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-number', cy.get('.v-application'))
	})

	it('displays the emotion rating picker', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: { type: 'emotion', label: 'Ressenti' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-emotion', cy.get('.v-application'))
	})

	it('displays the rating picker in readonly mode', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: { type: 'stars', label: 'Évaluation', readonly: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('rating-picker-readonly', cy.get('.v-application'))
	})

	// Ring DS d'une étoile focusée : `box-shadow: inset 2px primary` (inset pour ne pas déborder
	// sur les étoiles voisines, dont les icônes 52px se chevauchent). Pas de fond.
	it('shows the DS ring on a focused star', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: { type: 'stars', label: 'Évaluation' },
		})

		focusVisible('.sy-stars-picker__item[tabindex="0"]')
		cy.wait(150)
		cy.matchImageSnapshot('rating-picker-stars-focus', cy.get('.v-application'))
	})

	// Ring DS d'un nombre focusé : `outline: 2px primary, offset 2px`. Fond retiré au focus (hover only).
	it('shows the DS ring on a focused number', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: { type: 'number', label: 'Satisfaction' },
		})

		focusVisible('.sy-number-picker__item[tabindex="0"]')
		cy.wait(150)
		cy.matchImageSnapshot('rating-picker-number-focus', cy.get('.v-application'))
	})

	// Ring DS d'une émotion focusée : `outline: 2px primary` (et non currentcolor, pour rester
	// lisible sur le fond coloré). Fond coloré au hover/sélection seulement, pas au focus.
	it('shows the DS ring on a focused emotion', () => {
		cy.mountWithVuetify(RatingPicker, {
			props: { type: 'emotion', label: 'Ressenti' },
		})

		focusVisible('.sy-emotion-picker__item[tabindex="0"]')
		cy.wait(150)
		cy.matchImageSnapshot('rating-picker-emotion-focus', cy.get('.v-application'))
	})
})
