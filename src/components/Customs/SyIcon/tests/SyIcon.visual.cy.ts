import SyIcon from '../SyIcon.vue'

describe('SyIcon - Visual regression tests', () => {
	it('displays a decorative icon by default', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: 'mdi-home',
				decorative: true,
			},
		})

		cy.get('.v-icon').should('be.visible')
		cy.matchImageSnapshot('sy-icon-decorative', cy.get('.v-icon'))
	})

	it('displays an informative icon with label', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: 'mdi-information',
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
				icon: 'mdi-star',
				decorative: true,
			},
		})

		cy.get('.v-icon').should('have.attr', 'aria-hidden', 'true')
	})

	it('displays an icon with a custom color', () => {
		cy.mountWithVuetify(SyIcon, {
			props: {
				icon: 'mdi-alert',
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
				icon: 'mdi-check',
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
				icon: 'mdi-pencil',
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
