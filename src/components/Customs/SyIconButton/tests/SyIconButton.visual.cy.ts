import SyIconButton from '../SyIconButton.vue'
import { mdiPencil, mdiDelete, mdiPlus } from '@mdi/js'

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
