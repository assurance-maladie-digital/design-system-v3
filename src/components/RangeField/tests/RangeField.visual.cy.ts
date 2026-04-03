import RangeField from '../RangeField.vue'

describe('RangeField - Tests de non-régression visuelle', () => {
	it('affiche le composant par défaut', () => {
		cy.mountWithVuetify(RangeField)

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-default')
	})

	it('affiche avec des valeurs min/max personnalisées', () => {
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

	it('affiche avec un pas personnalisé', () => {
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

	it('affiche avec un label de fieldset', () => {
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

	it('affiche avec un fond personnalisé', () => {
		cy.mountWithVuetify(RangeField, {
			props: {
				bgColor: '#f0f0f0',
			},
		})

		cy.get('[data-cy-root]').children().should('exist')
		cy.matchImageSnapshot('range-field-custom-bg')
	})
})
