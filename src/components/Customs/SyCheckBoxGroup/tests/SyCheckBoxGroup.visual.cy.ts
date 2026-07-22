import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultOptions = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

describe('SyCheckBoxGroup - Visual regression tests', () => {
	it('displays the checkbox group by default', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: { options: defaultOptions },
		})

		cy.get('.sy-checkbox-group').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-default', cy.get('.sy-checkbox-group'))
	})

	it('displays the checkbox group with some items selected', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				modelValue: ['a', 'c'],
				multiple: true,
			},
		})

		cy.get('.sy-checkbox-group').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-selected', cy.get('.sy-checkbox-group'))
	})

	it('displays the checkbox group with a label', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				label: 'Choisissez vos options',
			},
		})

		cy.get('.sy-checkbox-group').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-with-label', cy.get('.sy-checkbox-group'))
	})

	it('displays the checkbox group in disabled state', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				disabled: true,
			},
		})

		cy.get('.sy-checkbox-group').should('be.visible')
		cy.matchImageSnapshot('sy-checkbox-group-disabled', cy.get('.sy-checkbox-group'))
	})

	// Aucun style de focus propre : le ring vient de SyCheckbox
	// (`.v-selection-control--focus-visible`, 2px primary, offset 2px). On focus la 1re case.
	it('shows the DS ring on a focused checkbox', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: { options: defaultOptions, label: 'Choix' },
		})

		focusVisible('.sy-checkbox-group input[type="checkbox"]')
		cy.wait(150)
		cy.matchImageSnapshot('sy-checkbox-group-focus', cy.get('.sy-checkbox-group'))
	})
})
