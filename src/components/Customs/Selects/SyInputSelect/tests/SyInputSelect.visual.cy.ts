import SyInputSelect from '../SyInputSelect.vue'

const defaultItems = [
	{ text: 'Option A', value: 'a' },
	{ text: 'Option B', value: 'b' },
	{ text: 'Option C', value: 'c' },
]

describe('SyInputSelect - Visual regression tests', () => {
	it('displays the input select by default', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: {
				items: defaultItems,
				label: 'Sélectionner',
			},
		})

		cy.get('.sy-input-select').should('be.visible')
		cy.matchImageSnapshot('sy-input-select-default', cy.get('.sy-input-select'))
	})

	it('displays the input select with a value', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: {
				items: defaultItems,
				label: 'Sélectionner',
				modelValue: 'b',
			},
		})

		cy.get('.sy-input-select').should('be.visible')
		cy.matchImageSnapshot('sy-input-select-with-value', cy.get('.sy-input-select'))
	})

	it('displays the input select as required', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: {
				items: defaultItems,
				label: 'Sélectionner',
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.sy-input-select').should('be.visible')
		cy.matchImageSnapshot('sy-input-select-required', cy.get('.sy-input-select'))
	})
})
