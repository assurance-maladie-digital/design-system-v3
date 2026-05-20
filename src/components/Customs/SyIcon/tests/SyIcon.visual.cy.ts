import SyIcon from '../SyIcon.vue'
import { mdiHome, mdiInformation, mdiStar, mdiAlert, mdiCheck, mdiPencil } from '@mdi/js'

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
})
