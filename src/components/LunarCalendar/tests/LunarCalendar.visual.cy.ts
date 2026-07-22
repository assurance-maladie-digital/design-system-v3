import LunarCalendar from '../LunarCalendar.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('LunarCalendar - Visual regression tests', () => {
	it('displays the lunar calendar field by default', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: { label: 'Date de naissance (calendrier lunaire)' },
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('lunar-calendar-default', cy.get('.v-text-field'))
	})

	it('displays the lunar calendar field as required', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				required: true,
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('lunar-calendar-required', cy.get('.v-text-field'))
	})

	it('displays the lunar calendar with a value', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: {
				label: 'Date de naissance',
				modelValue: '15/08/1990',
			},
		})

		cy.get('.v-text-field').should('be.visible')
		cy.matchImageSnapshot('lunar-calendar-with-value', cy.get('.v-text-field'))
	})

	// Aucun style de focus propre : tout vient de SyTextField. Input focus => bordure primary.
	it('shows the primary field border on a focused input', () => {
		cy.mountWithVuetify(LunarCalendar, {
			props: { label: 'Date de naissance' },
		})

		focusVisible('.v-text-field input')
		cy.wait(150)
		cy.matchImageSnapshot('lunar-calendar-input-focus', cy.get('.v-text-field'))
	})
})
