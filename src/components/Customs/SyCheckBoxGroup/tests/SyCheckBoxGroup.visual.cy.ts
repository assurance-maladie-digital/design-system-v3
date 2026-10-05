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

	// Régression : la bordure des cases non cochées doit être rouge en erreur
	it('displays the checkbox group in error state', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				label: 'Choisissez vos options',
				required: true,
				errorMessages: ['Ce champ est requis'],
			},
		})

		cy.get('.sy-checkbox-group').should('have.class', 'error-field')
		cy.matchImageSnapshot('sy-checkbox-group-error', cy.get('.sy-checkbox-group'))
	})

	it('displays the checkbox group in error state with a checked option', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				label: 'Choisissez vos options',
				multiple: true,
				modelValue: ['b'],
				errorMessages: ['Sélection invalide'],
			},
		})

		cy.get('.sy-checkbox-group').should('have.class', 'error-field')
		cy.matchImageSnapshot('sy-checkbox-group-error-checked', cy.get('.sy-checkbox-group'))
	})

	it('displays the checkbox group in warning state', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				label: 'Choisissez vos options',
				warningMessages: ['Attention à votre choix'],
			},
		})

		cy.get('.sy-checkbox-group').should('have.class', 'warning-field')
		cy.matchImageSnapshot('sy-checkbox-group-warning', cy.get('.sy-checkbox-group'))
	})

	it('displays the checkbox group in success state', () => {
		cy.mountWithVuetify(SyCheckBoxGroup, {
			props: {
				options: defaultOptions,
				label: 'Choisissez vos options',
				showSuccessMessages: true,
				successMessages: ['Choix valide'],
			},
		})

		cy.get('.sy-checkbox-group').should('have.class', 'success-field')
		cy.matchImageSnapshot('sy-checkbox-group-success', cy.get('.sy-checkbox-group'))
	})
})
