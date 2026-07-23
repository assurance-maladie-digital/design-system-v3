import CookiesSelection from '../CookiesSelection.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultItems = {
	analytics: [
		{ name: 'Matomo', description: 'Mesure d\'audience', conservation: '13 mois' },
	],
	functional: [
		{ name: 'Préférences', description: 'Sauvegarde les préférences utilisateur', conservation: '12 mois' },
	],
}

describe('CookiesSelection - Visual regression tests', () => {
	it('displays cookies selection with items', () => {
		cy.mountWithVuetify(CookiesSelection, {
			props: { items: defaultItems },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('cookies-selection-default', cy.get('.v-application'))
	})

	// Bouton « Enregistrer » standalone → ring DS via l'override global `_btns.scss`.
	it('shows the global ring on the focused submit button', () => {
		cy.mountWithVuetify(CookiesSelection, {
			props: { items: defaultItems },
		})

		focusVisible('[data-test-id="submit"]')
		cy.wait(150)
		cy.matchImageSnapshot('cookies-selection-submit-focus', cy.get('.v-application'))
	})

	// Radios Vuetify bruts : ring DS radio ajouté dans CookiesInformation
	// (`.v-selection-control--focus-visible`, 2px primary, offset 2px).
	it('shows the DS ring on a focused radio', () => {
		cy.mountWithVuetify(CookiesSelection, {
			props: { items: defaultItems },
		})

		focusVisible('input[type="radio"]')
		cy.wait(150)
		cy.matchImageSnapshot('cookies-selection-radio-focus', cy.get('.v-application'))
	})

	// `<summary>` (élément interactif natif) : ring DS ajouté dans CookiesInformation
	// (non couvert par les overrides globaux `_btns.scss`/`_links.scss`).
	it('shows the DS ring on a focused details summary', () => {
		cy.mountWithVuetify(CookiesSelection, {
			props: { items: defaultItems },
		})

		focusVisible('details > summary')
		cy.wait(150)
		cy.matchImageSnapshot('cookies-selection-summary-focus', cy.get('.v-application'))
	})
})
