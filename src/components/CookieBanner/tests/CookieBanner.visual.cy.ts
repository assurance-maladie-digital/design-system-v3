import CookieBanner from '../CookieBanner.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('CookieBanner - Visual regression tests', () => {
	it('displays the cookie banner', () => {
		cy.mountWithVuetify(CookieBanner, {
			props: { modelValue: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('cookie-banner-default', cy.get('.v-application'))
	})

	it('displays the cookie banner with custom items', () => {
		cy.mountWithVuetify(CookieBanner, {
			props: {
				modelValue: true,
				items: {
					analytics: {
						title: 'Mesure d\'audience',
						description: 'Ces cookies permettent de mesurer la fréquentation du site.',
					},
				},
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('cookie-banner-with-items', cy.get('.v-application'))
	})

	// Boutons d'action standalone → ring DS via l'override global `_btns.scss`. Ils sont dans un
	// conteneur `overflow-y: auto` (qui rogne les deux axes) : le padding réservé sur le conteneur
	// évite que le bas (et la gauche en mobile) du ring soit rogné. Ce test le vérifie.
	it('shows the DS ring on a focused action button', () => {
		cy.mountWithVuetify(CookieBanner, {
			props: { modelValue: true },
		})

		cy.get('[data-test-id="accept"]').should('be.visible')
		focusVisible('[data-test-id="accept"]')
		cy.wait(150)
		cy.matchImageSnapshot('cookie-banner-action-focus', cy.get('.vd-cookie-banner'))
	})
})
