import CopyBtn from '../CopyBtn.vue'

describe('CopyBtn - Visual regression tests', () => {
	it('displays the copy button by default', () => {
		cy.mountWithVuetify(CopyBtn, {
			props: { textToCopy: 'Texte à copier' },
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('copy-btn-default', cy.get('.v-btn'))
	})

	it('displays the copy button without tooltip', () => {
		cy.mountWithVuetify(CopyBtn, {
			props: {
				textToCopy: 'Texte à copier',
				hideTooltip: true,
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('copy-btn-no-tooltip', cy.get('.v-btn'))
	})
})
