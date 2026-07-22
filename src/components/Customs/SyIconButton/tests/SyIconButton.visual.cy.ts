import SyIconButton from '../SyIconButton.vue'
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyIconButton - Visual regression tests', () => {
	it('displays the icon button by default', () => {
		cy.mountWithVuetify(SyIconButton, {
			props: {
				icon: mdiPencil,
				label: 'Modifier',
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('sy-icon-button-default', cy.get('.v-btn'))
	})

	it('displays the icon button with primary color', () => {
		cy.mountWithVuetify(SyIconButton, {
			props: {
				icon: mdiDelete,
				label: 'Supprimer',
				color: 'error',
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('sy-icon-button-error', cy.get('.v-btn'))
	})

	it('displays the icon button in large size', () => {
		cy.mountWithVuetify(SyIconButton, {
			props: {
				icon: mdiPlus,
				label: 'Ajouter',
				size: 'large',
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('sy-icon-button-large', cy.get('.v-btn'))
	})

	it('displays the icon button in disabled state', () => {
		cy.mountWithVuetify(SyIconButton, {
			props: {
				icon: mdiPencil,
				label: 'Modifier',
				disabled: true,
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('sy-icon-button-disabled', cy.get('.v-btn'))
	})
})

describe('SyIconButton - Focus visual regression tests', () => {
	// Ring standard fourni par l'override global (2px primary, offset 3px). Capture
	// `.v-application` pour ne pas rogner le ring outset (bouton circulaire).
	it('shows the standard ring on the button', () => {
		cy.mountWithVuetify(SyIconButton, {
			props: { icon: mdiPencil, label: 'Modifier' },
		})

		focusVisible('.v-btn')
		cy.wait(100)
		cy.matchImageSnapshot('sy-icon-button-focus', cy.get('.v-application'))
	})
})
