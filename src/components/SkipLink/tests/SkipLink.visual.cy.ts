import SkipLink from '../SkipLink.vue'

describe('SkipLink - Visual regression tests', () => {
	it('displays the skip link (visually hidden by default)', () => {
		cy.mountWithVuetify(SkipLink)

		cy.get('.sy-skip-link-container').should('exist')
		cy.matchImageSnapshot('skip-link-default', cy.get('.v-application'))
	})

	it('displays the skip link with custom label', () => {
		cy.mountWithVuetify(SkipLink, {
			props: {
				label: 'Aller au contenu principal',
				target: '#main',
			},
		})

		cy.get('.sy-skip-link-container').should('exist')
		cy.matchImageSnapshot('skip-link-custom-label', cy.get('.v-application'))
	})
})
