import SyInputSelect from '../SyInputSelect.vue'

const defaultItems = [
	{ text: 'Option A', value: 'a' },
	{ text: 'Option B', value: 'b' },
	{ text: 'Option C', value: 'c' },
]

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyInputSelect - Visual regression tests', () => {
	it('displays the input select by default', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: {
				items: defaultItems,
				label: 'Sélectionner',
			},
		})

		cy.get('.sy-input-select').should('be.visible')
		cy.matchImageSnapshot('sy-input-select-default', cy.get('.sy-input-select'))
	})

	it('displays the input select with a value', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: {
				items: defaultItems,
				label: 'Sélectionner',
				modelValue: 'b',
			},
		})

		cy.get('.sy-input-select').should('be.visible')
		cy.matchImageSnapshot('sy-input-select-with-value', cy.get('.sy-input-select'))
	})

	it('displays the input select as required', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: {
				items: defaultItems,
				label: 'Sélectionner',
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.sy-input-select').should('be.visible')
		cy.matchImageSnapshot('sy-input-select-required', cy.get('.sy-input-select'))
	})
})

describe('SyInputSelect - Focus visual regression tests', () => {
	// Déclencheur (faux-bouton) : ring 2px primary outset (offset 3px).
	it('shows the ring on the trigger', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: { items: defaultItems, label: 'Sélectionner' },
		})

		focusVisible('.sy-input-select')
		cy.wait(100)
		cy.matchImageSnapshot('sy-input-select-focus-trigger', cy.get('.v-application'))
	})

	// Option de la liste (custom, non couverte par _menus.scss) : ring 2px primary inset (-3px).
	it('shows the inset ring on a focused option', () => {
		cy.mountWithVuetify(SyInputSelect, {
			props: { items: defaultItems, label: 'Sélectionner' },
		})

		cy.get('.sy-input-select').click()
		cy.get('.v-list-item').should('be.visible')
		focusVisible('.v-list-item')
		cy.wait(100)
		cy.matchImageSnapshot('sy-input-select-focus-option', cy.get('.v-application'))
	})
})
