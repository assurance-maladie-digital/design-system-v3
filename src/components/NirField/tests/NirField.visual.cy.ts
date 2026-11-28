import NirField from '../NirField.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('NirField - Visual regression tests', () => {
	// Viewport réduit : le champ prend toute la largeur du viewport.
	beforeEach(() => {
		cy.viewport(450, 250)
	})

	it('displays the NIR field by default', () => {
		cy.mountWithVuetify(NirField)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-default', cy.get('.nir-field'), { padding: 10 })
	})

	it('displays the NIR field with key display', () => {
		cy.mountWithVuetify(NirField, {
			props: { displayKey: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-with-key', cy.get('.nir-field'), { padding: 10 })
	})

	it('displays the NIR field in complex mode', () => {
		cy.mountWithVuetify(NirField, {
			props: { nirType: 'complexe' },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('nir-field-complex', cy.get('.nir-field'), { padding: 10 })
	})

	// NirField ne porte aucun style de focus propre : tout vient de SyTextField.
	// Input focus => bordure primary du champ (défaut Vuetify color="primary").
	it('shows the primary field border on a focused input', () => {
		cy.mountWithVuetify(NirField, {
			props: { displayKey: true },
		})

		focusVisible('.number-field input')
		cy.matchImageSnapshot('nir-field-input-focus', cy.get('.nir-field'), { padding: 10 })
	})
})
