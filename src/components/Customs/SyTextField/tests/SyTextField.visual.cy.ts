import SyTextField from '../SyTextField.vue'

describe('SyTextField - Visual regression tests', () => {
	it('displays the text field by default', () => {
		cy.mountWithVuetify(SyTextField, {
			props: { label: 'Prénom' },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-text-field-default', cy.get('.v-text-field'))
	})

	it('displays the text field with a value', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Prénom',
				modelValue: 'Jean',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-text-field-with-value', cy.get('.v-text-field'))
	})

	it('displays the text field as required', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Prénom',
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-text-field-required', cy.get('.v-text-field'))
	})

	it('displays the text field in readonly state', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Prénom',
				modelValue: 'Jean',
				readonly: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-text-field-readonly', cy.get('.v-text-field'))
	})

	it('displays the text field with clearable', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Prénom',
				modelValue: 'Jean',
				isClearable: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-text-field-clearable', cy.get('.v-text-field'))
	})

	it('displays the text field with prepend icon', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Recherche',
				prependInnerIcon: 'info',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('sy-text-field-prepend-icon', cy.get('.v-text-field'))
	})

	it('displays the number field with the custom spin buttons', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Quantité',
				type: 'number',
				modelValue: '42',
			},
		})

		cy.get('.sy-text-field__spinner').should('be.visible')
		cy.matchImageSnapshot('sy-text-field-number', cy.get('.v-text-field'))
	})

	it('displays the number field without the spin buttons when hidden', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Quantité',
				type: 'number',
				modelValue: '42',
				areSpinButtonsHidden: true,
			},
		})

		cy.get('.sy-text-field__spinner').should('not.exist')
		cy.matchImageSnapshot('sy-text-field-number-no-spinner', cy.get('.v-text-field'))
	})

	it('displays the number field disabled without the spin buttons', () => {
		cy.mountWithVuetify(SyTextField, {
			props: {
				label: 'Quantité',
				type: 'number',
				modelValue: '42',
				disabled: true,
			},
		})

		cy.get('.sy-text-field__spinner').should('not.exist')
		cy.matchImageSnapshot('sy-text-field-number-disabled', cy.get('.v-text-field'))
	})
})
