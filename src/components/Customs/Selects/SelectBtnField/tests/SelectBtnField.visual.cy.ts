import SelectBtnField from '../SelectBtnField.vue'

const defaultItems = [
	{ text: 'Oui', value: 'oui' },
	{ text: 'Non', value: 'non' },
]

describe('SelectBtnField - Visual regression tests', () => {
	it('displays the button select field by default', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-default', cy.get('.v-application'))
	})

	it('displays the button select field with a selected value', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
				modelValue: 'oui',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-selected', cy.get('.v-application'))
	})

	it('displays the button select field in inline mode', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
				inline: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-inline', cy.get('.v-application'))
	})

	it('displays the button select field in readonly mode', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
				modelValue: 'non',
				readonly: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-readonly', cy.get('.v-application'))
	})
})
