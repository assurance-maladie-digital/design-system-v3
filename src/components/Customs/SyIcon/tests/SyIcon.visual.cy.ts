import SyIcon from '../SyIcon.vue'
import { mdiHome, mdiInformation, mdiStar, mdiAlert, mdiCheck, mdiPencil } from '@mdi/js'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyIcon - Visual regression tests', () => {
	it('displays a decorative icon by default', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: mdiHome,
				decorative: true,
			},
		})

		cy.get('.v-icon').should('be.visible')
		cy.matchImageSnapshot('sy-icon-decorative', cy.get('.v-icon'))
	})

	it('displays an informative icon with label', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: mdiInformation,
				decorative: false,
				label: 'Information importante',
			},
		})

		cy.get('.v-icon').should('be.visible')
		cy.get('.v-icon').should('have.attr', 'aria-label', 'Information importante')
		cy.matchImageSnapshot('sy-icon-informative', cy.get('.v-icon'))
	})

	it('hides a decorative icon from assistive tech (aria-hidden)', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: mdiStar,
				decorative: true,
			},
		})

		cy.get('.v-icon').should('have.attr', 'aria-hidden', 'true')
	})

	it('displays an icon with a custom color', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: mdiAlert,
				decorative: true,
				color: 'error',
			},
		})

		cy.get('.v-icon').should('be.visible')
		cy.matchImageSnapshot('sy-icon-color-error', cy.get('.v-icon'))
	})

	it('displays an icon with size large', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: mdiCheck,
				decorative: true,
				size: 'large',
			},
		})

		cy.get('.v-icon').should('be.visible')
		cy.matchImageSnapshot('sy-icon-size-large', cy.get('.v-icon'))
	})

	it('displays an icon with role button', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: mdiPencil,
				decorative: false,
				label: 'Éditer',
				role: 'button',
			},
		})

		cy.get('.v-icon').should('be.visible')
		cy.get('.v-icon').should('have.attr', 'role', 'button')
		cy.get('.v-icon').should('have.attr', 'aria-label', 'Éditer')
		cy.matchImageSnapshot('sy-icon-role-button', cy.get('.v-icon'))
	})

	// Une icône interactive (role="button" → tabindex=0 via rgaaSvgFix) est focusable mais n'est ni
	// <button> ni .v-btn : le ring DS vient du style scoped de SyIcon (2px primary, offset 3px,
	// aligné sur la convention bouton).
	it('shows the DS ring on a focused interactive (button) icon', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: mdiPencil,
				decorative: false,
				label: 'Éditer',
				role: 'button',
			},
		})

		cy.get('.v-icon').should('have.attr', 'tabindex', '0')
		focusVisible('.v-icon[role="button"]')
		cy.wait(150)
		cy.matchImageSnapshot('sy-icon-button-focus', cy.get('.v-icon'))
	})
})
