import SyRadioGroup from '../SyRadioGroup.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultOptions = [
	{ label: 'Option A', value: 'A' },
	{ label: 'Option B', value: 'B' },
	{ label: 'Option C', value: 'C' },
]

describe('SyRadioGroup - Visual regression tests', () => {
	it('displays the radio group by default', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Test Radio Group',
				options: defaultOptions,
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-default', cy.get('.v-radio-group'))
	})

	it('displays the radio group with a selected value', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Test Radio Group',
				modelValue: 'B',
				options: defaultOptions,
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-selected', cy.get('.v-radio-group'))
	})

	it('displays the radio group in error state', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Required Radio Group',
				required: true,
				options: defaultOptions,
				hasError: true,
				errorMessages: ['Ce champ est requis.'],
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.get('.v-radio-group').should('have.class', 'error-field')
		cy.matchImageSnapshot('sy-radio-group-error', cy.get('.v-radio-group'))
	})

	it('displays the radio group in warning state', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Radio Group with Warning',
				options: defaultOptions,
				hasWarning: true,
				warningMessages: ['This is a warning message'],
				showSuccessMessages: true,
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.get('.v-radio-group').should('have.class', 'warning-field')
		cy.matchImageSnapshot('sy-radio-group-warning', cy.get('.v-radio-group'))
	})

	it('displays the radio group in success state', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Radio Group with Success',
				options: defaultOptions,
				modelValue: 'A',
				required: true,
				hasSuccess: true,
				showSuccessMessages: true,
				successMessages: ['Sélection valide.'],
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.get('.v-radio-group').should('have.class', 'success-field')
		cy.matchImageSnapshot('sy-radio-group-success', cy.get('.v-radio-group'))
	})

	it('displays the radio group when disabled', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Disabled Radio Group',
				options: defaultOptions,
				modelValue: 'B',
				disabled: true,
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-disabled', cy.get('.v-radio-group'))
	})

	it('displays the radio group when readonly', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Readonly Radio Group',
				options: defaultOptions,
				modelValue: 'B',
				readonly: true,
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-readonly', cy.get('.v-radio-group'))
	})

	it('displays the radio group with compact density', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Compact Radio Group',
				options: defaultOptions,
				density: 'compact',
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-compact', cy.get('.v-radio-group'))
	})

	it('displays the radio group with comfortable density', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Comfortable Radio Group',
				options: defaultOptions,
				density: 'comfortable',
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-comfortable', cy.get('.v-radio-group'))
	})

	it('displays the radio group with asterisk', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Required Radio Group',
				options: defaultOptions,
				required: true,
				displayAsterisk: true,
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-asterisk', cy.get('.v-radio-group'))
	})

	it('displays the radio group without details', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: {
				label: 'Radio Group without details',
				options: defaultOptions,
				hideDetails: true,
			},
		})

		cy.get('.v-radio-group').should('be.visible')
		cy.matchImageSnapshot('sy-radio-group-no-details', cy.get('.v-radio-group'))
	})

	// Ring DS au clavier ajouté sur les radios : `.v-selection-control--focus-visible`
	// (2px primary, offset 2px, aligné sur SyCheckbox). On focus le 1er radio.
	it('shows the DS ring on a focused radio', () => {
		cy.mountWithVuetify(SyRadioGroup, {
			props: { label: 'Choix', options: defaultOptions },
		})

		focusVisible('.v-radio-group input[type="radio"]')
		cy.wait(150)
		cy.matchImageSnapshot('sy-radio-group-focus', cy.get('.v-radio-group'))
	})
})
