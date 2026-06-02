import SyHeading from '../SyHeading.vue'

describe('SyHeading - Visual regression tests', () => {
	it('displays a level 1 heading', () => {
		cy.mountWithVuetify(SyHeading, {
			props: { level: 1 },
			slots: { default: 'Titre de niveau 1' },
		})

		cy.get('.sy-heading').should('be.visible')
		cy.matchImageSnapshot('sy-heading-level-1', cy.get('.sy-heading'))
	})

	it('displays a level 2 heading', () => {
		cy.mountWithVuetify(SyHeading, {
			props: { level: 2 },
			slots: { default: 'Titre de niveau 2' },
		})

		cy.get('.sy-heading').should('be.visible')
		cy.matchImageSnapshot('sy-heading-level-2', cy.get('.sy-heading'))
	})

	it('displays a level 3 heading', () => {
		cy.mountWithVuetify(SyHeading, {
			props: { level: 3 },
			slots: { default: 'Titre de niveau 3' },
		})

		cy.get('.sy-heading').should('be.visible')
		cy.matchImageSnapshot('sy-heading-level-3', cy.get('.sy-heading'))
	})
})
