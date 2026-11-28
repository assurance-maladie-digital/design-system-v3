import { h } from 'vue'
import RangeField from '../RangeField.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('RangeField - Visual regression tests', () => {
	// Conteneur de 450px : le champ suit le conteneur (le switch mobile du
	// composant lit le viewport, qui reste >= 960px).
	beforeEach(() => {
		cy.viewport(960, 300)
	})

	function InContainer(props: Record<string, unknown> = {}) {
		return {
			setup: () => () => h(
				'div',
				{ style: 'width: 450px' },
				[h(RangeField, props)],
			),
		}
	}

	it('displays the component by default', () => {
		cy.mountWithVuetify(InContainer())

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-default', cy.get('.sy-range-field'), { padding: 10 })
	})

	it('displays with custom min/max values', () => {
		cy.mountWithVuetify(InContainer({
			'min': 0,
			'max': 500,
			'modelValue': [100, 400],
			'onUpdate:modelValue': () => {},
		}))

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-custom-range', cy.get('.sy-range-field'), { padding: 10 })
	})

	it('displays with custom step', () => {
		cy.mountWithVuetify(InContainer({
			'min': 0,
			'max': 100,
			'step': 10,
			'modelValue': [20, 80],
			'onUpdate:modelValue': () => {},
		}))

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-step', cy.get('.sy-range-field'), { padding: 10 })
	})

	it('displays with fieldset label', () => {
		cy.mountWithVuetify(InContainer({
			'fieldsetLabel': 'Fourchette de prix (€)',
			'min': 0,
			'max': 1000,
			'modelValue': [200, 800],
			'onUpdate:modelValue': () => {},
		}))

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-with-label', cy.get('.sy-range-field'), { padding: 10 })
	})

	it('displays with custom background', () => {
		cy.mountWithVuetify(InContainer({
			bgColor: '#f0f0f0',
		}))

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-custom-bg', cy.get('.sy-range-field'), { padding: 10 })
	})

	// Thumb du RangeSlider (`role="slider"`) : cadre de focus DS (2px primary) réservé au
	// clavier (`:focus-visible`). Le cadre s'étend au-dessus du thumb → on capture la vue
	// entière pour ne pas le clipper.
	it('shows the DS focus frame on a keyboard-focused slider thumb', () => {
		cy.mountWithVuetify(InContainer({ min: 0, max: 100, modelValue: [20, 80] }))

		focusVisible('.thumb-min[role="slider"]')
		cy.matchImageSnapshot('range-field-thumb-focus', cy.get('.sy-range-field'), { padding: 10 })
	})
})
