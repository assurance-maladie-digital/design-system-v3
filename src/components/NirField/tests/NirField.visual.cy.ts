import NirField from '../NirField.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('NirField - Visual regression tests', () => {
	it('displays the NIR field by default', () => {
		cy.mountWithVuetify(NirField)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-default', cy.get('.v-application'))
	})

	it('displays the NIR field with key display', () => {
		cy.mountWithVuetify(NirField, {
			props: { displayKey: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-with-key', cy.get('.v-application'))
	})

	it('displays the NIR field in complex mode', () => {
		cy.mountWithVuetify(NirField, {
			props: { nirType: 'complexe' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-complex', cy.get('.v-application'))
	})

	// NirField ne porte aucun style de focus propre : tout vient de SyTextField.
	// Input focus => bordure primary du champ (défaut Vuetify color="primary").
	it('shows the primary field border on a focused input', () => {
		cy.mountWithVuetify(NirField, {
			props: { displayKey: true },
		})

		focusVisible('.number-field input')
		cy.wait(150)
		cy.matchImageSnapshot('nir-field-input-focus', cy.get('.v-application'))
	})

	// Icône info (tooltip) : ring DS défini par SyTextField
	// (`.v-input__append .v-icon:focus-visible`, 2px primary, offset 2px).
	it('shows the DS ring on a focused info tooltip icon', () => {
		cy.mountWithVuetify(NirField, {
			props: {
				displayKey: true,
				nirTooltip: 'Numéro de sécurité sociale',
				nirTooltipPosition: 'append',
			},
		})

		focusVisible('.number-field .v-input__append .v-icon')
		cy.wait(150)
		cy.matchImageSnapshot('nir-field-info-icon-focus', cy.get('.v-application'))
	})
})
