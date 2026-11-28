import LangBtn from '../LangBtn.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('LangBtn - Visual regression tests', () => {
	it('displays the language button by default', () => {
		cy.mountWithVuetify(LangBtn, {
			props: { modelValue: 'fr' },
		})

		cy.get('.vd-lang-btn').should('be.visible')
		cy.matchImageSnapshot('lang-btn-default', cy.get('.vd-lang-btn'))
	})

	it('displays the language button with English selected', () => {
		cy.mountWithVuetify(LangBtn, {
			props: { modelValue: 'en' },
		})

		cy.get('.vd-lang-btn').should('be.visible')
		cy.matchImageSnapshot('lang-btn-english', cy.get('.vd-lang-btn'))
	})

	it('displays the language button without down arrow', () => {
		cy.mountWithVuetify(LangBtn, {
			props: {
				modelValue: 'fr',
				hideDownArrow: true,
			},
		})

		cy.get('.vd-lang-btn').should('be.visible')
		cy.matchImageSnapshot('lang-btn-no-arrow', cy.get('.vd-lang-btn'))
	})
})

describe('LangBtn - Focus visual regression tests', () => {
	// Activateur (VBtn outlined) : ring standard global (2px primary, offset 3px).
	it('shows the standard ring on the activator button', () => {
		cy.mountWithVuetify(LangBtn, {
			props: { modelValue: 'fr' },
		})

		focusVisible('.vd-lang-btn')
		cy.matchImageSnapshot('lang-btn-focus-btn', cy.get('.vd-lang-btn'), { padding: 10 })
	})

	// Item de menu : ring inset (-3px). On attend que l'auto-focus du composant se pose
	// avant de forcer le :focus-visible sur l'item.
	it('shows the inset ring on a focused menu item', () => {
		cy.mountWithVuetify(LangBtn, {
			props: { modelValue: 'fr' },
		})

		cy.get('.vd-lang-btn').click()
		// Attendre que l'autofocus du menu se pose (one-shot) avant de re-forcer
		// le :focus-visible sur l'item.
		cy.get('.v-list-item').should('be.visible').should('be.focused')
		focusVisible('.v-list-item')
		cy.matchImageSnapshot('lang-btn-focus-item', cy.get('.v-list-item').first())
	})
})
