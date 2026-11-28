import DiacriticPicker from '../DiacriticPicker.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('DiacriticPicker - Visual regression tests', () => {
	// Viewport réduit : le titre prend toute la largeur du viewport.
	beforeEach(() => {
		cy.viewport(400, 80)
	})

	it('displays the diacritic picker button', () => {
		cy.mountWithVuetify(DiacriticPicker, {
			props: { modelValue: '' },
		})

		cy.get('.sy-diacritic-wrapper').should('be.visible')
		cy.matchImageSnapshot('diacritic-picker-default', cy.get('.sy-diacritic-wrapper'), { padding: 10 })
	})

	it('displays the diacritic picker with custom button title', () => {
		cy.mountWithVuetify(DiacriticPicker, {
			props: {
				modelValue: '',
				btnTitle: 'àÀ',
			},
		})

		cy.get('.sy-diacritic-wrapper').should('be.visible')
		cy.matchImageSnapshot('diacritic-picker-custom-title', cy.get('.sy-diacritic-wrapper'), { padding: 10 })
	})

	// Bouton d'ouverture : ring standard global (2px primary, offset 3px).
	it('shows the global ring on the focused opening button', () => {
		cy.mountWithVuetify(DiacriticPicker, {
			props: { modelValue: '' },
		})

		focusVisible('.sy-diacritic-btn')
		cy.matchImageSnapshot('diacritic-picker-button-focus', cy.get('.sy-diacritic-wrapper'), { padding: 10 })
	})
})
