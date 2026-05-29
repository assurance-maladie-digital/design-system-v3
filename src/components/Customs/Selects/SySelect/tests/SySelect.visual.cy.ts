import SySelect from '../SySelect.vue'

const defaultItems = [
	{ text: 'Option A', value: 'a' },
	{ text: 'Option B', value: 'b' },
	{ text: 'Option C', value: 'c' },
]

describe('SySelect - Visual regression tests', () => {
	it('displays the select by default', () => {
		cy.mountWithVuetify(SySelect, {
			props: {
				items: defaultItems,
				label: 'Choisir une option',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-select-default', cy.get('.v-text-field'))
	})

	it('displays the select with a selected value', () => {
		cy.mountWithVuetify(SySelect, {
			props: {
				items: defaultItems,
				label: 'Choisir une option',
				modelValue: 'b',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-select-with-value', cy.get('.v-text-field'))
	})

	it('displays the select as required', () => {
		cy.mountWithVuetify(SySelect, {
			props: {
				items: defaultItems,
				label: 'Choisir une option',
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-select-required', cy.get('.v-text-field'))
	})

	it('displays the select with multiple selection and chips', () => {
		cy.mountWithVuetify(SySelect, {
			props: {
				items: defaultItems,
				label: 'Choisir plusieurs options',
				multiple: true,
				chips: true,
				modelValue: ['a', 'c'],
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-select-multiple-chips', cy.get('.v-text-field'))
	})

	it('displays the select with clearable option', () => {
		cy.mountWithVuetify(SySelect, {
			props: {
				items: defaultItems,
				label: 'Choisir une option',
				clearable: true,
				modelValue: 'a',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-select-clearable', cy.get('.v-text-field'))
	})
})
