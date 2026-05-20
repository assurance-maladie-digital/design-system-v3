import BackToTopBtn from '../BackToTopBtn.vue'

describe('BackToTopBtn - Visual regression tests', () => {
	it('displays the button when visible is forced', () => {
		cy.mountWithVuetify(BackToTopBtn, {
			props: { threshold: 0 },
		})

		cy.get('.v-btn').should('exist')
		cy.matchImageSnapshot('back-to-top-btn-default', cy.get('.v-application'))
	})

	it('displays the button with custom nudge', () => {
		cy.mountWithVuetify(BackToTopBtn, {
			props: {
				threshold: 0,
				nudgeRight: '32px',
				nudgeBottom: '32px',
			},
		})

		cy.get('.v-btn').should('exist')
		cy.matchImageSnapshot('back-to-top-btn-custom-nudge', cy.get('.v-application'))
	})
})
