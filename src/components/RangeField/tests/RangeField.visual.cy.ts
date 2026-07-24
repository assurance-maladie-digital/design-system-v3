import RangeField from '../RangeField.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('RangeField - Visual regression tests', () => {
	it('displays the component by default', () => {
		cy.mountWithVuetify(RangeField)

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-default')
	})

	it('displays with custom min/max values', () => {
		cy.mountWithVuetify(RangeField, {
			props: {
				'min': 0,
				'max': 500,
				'modelValue': [100, 400],
				'onUpdate:modelValue': () => {},
			},
		})

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-custom-range')
	})

	it('displays with custom step', () => {
		cy.mountWithVuetify(RangeField, {
			props: {
				'min': 0,
				'max': 100,
				'step': 10,
				'modelValue': [20, 80],
				'onUpdate:modelValue': () => {},
			},
		})

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-step')
	})

	it('displays with fieldset label', () => {
		cy.mountWithVuetify(RangeField, {
			props: {
				'fieldsetLabel': 'Fourchette de prix (€)',
				'min': 0,
				'max': 1000,
				'modelValue': [200, 800],
				'onUpdate:modelValue': () => {},
			},
		})

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-with-label')
	})

	it('displays with custom background', () => {
		cy.mountWithVuetify(RangeField, {
			props: {
				bgColor: '#f0f0f0',
			},
		})

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-custom-bg')
	})

	// Thumb du RangeSlider (`role="slider"`) : cadre de focus DS (2px primary) réservé au
	// clavier (`:focus-visible`). Le cadre s'étend au-dessus du thumb → on capture la vue
	// entière pour ne pas le clipper.
	it('shows the DS focus frame on a keyboard-focused slider thumb', () => {
		cy.mountWithVuetify(RangeField, {
			props: { min: 0, max: 100, modelValue: [20, 80] },
		})

		focusVisible('.thumb-min[role="slider"]')
		cy.wait(150)
		cy.matchImageSnapshot('range-field-thumb-focus')
	})
})
