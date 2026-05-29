import SyCheckbox from '../SyCheckbox.vue'

describe('SyCheckbox - Visual regression tests', () => {
	it('displays the checkbox unchecked by default', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: { label: 'J\'accepte les conditions' },
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-unchecked', cy.get('.v-checkbox'))
	})

	it('displays the checkbox checked', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'J\'accepte les conditions',
				modelValue: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-checked', cy.get('.v-checkbox'))
	})

	it('displays the checkbox in indeterminate state', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'Sélectionner tout',
				indeterminate: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-indeterminate', cy.get('.v-checkbox'))
	})

	it('displays the checkbox in disabled state', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'Option désactivée',
				disabled: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-disabled', cy.get('.v-checkbox'))
	})

	it('displays the checkbox as required', () => {
		cy.mountWithVuetify(SyCheckbox, {
			props: {
				label: 'Champ obligatoire',
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.v-checkbox').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-required', cy.get('.v-checkbox'))
	})
})
