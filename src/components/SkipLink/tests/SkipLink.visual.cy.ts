import SkipLink from '../SkipLink.vue'

describe('SkipLink - Visual regression tests', () => {
	it('displays the skip link when focused', () => {
		cy.mountWithVuetify(SkipLink, {
			props: {
				label: 'Aller au contenu principal',
				target: '#main',
			},
		})

		// Le ring est sur `:focus` → un focus simple suffit à afficher barre + ring.
		cy.get('.sy-skip-link').focus()
		cy.get('.sy-skip-link').should('be.visible')
		cy.matchImageSnapshot('skip-link-focused', cy.get('.v-application'))
	})
})
