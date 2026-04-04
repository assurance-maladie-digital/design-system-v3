import RangeField from '../RangeField.vue'

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
})
