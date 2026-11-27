import DialogBox from '../DialogBox.vue'

describe('DialogBox – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 12.8 – exposes a modal with a named close control', () => {
		cy.mountWithVuetify(DialogBox, {
			props: { modelValue: true, title: 'Confirmation' },
			slots: { default: 'Confirmez cette action.' },
		})
		cy.get('.sy-dialog-box').should('have.attr', 'aria-modal', 'true')
		cy.get('.sy-dialog-box-close-btn').should('have.attr', 'aria-label', 'Fermer la boîte de dialogue')
	})

	it('3.3 and 10.7 – exposes a visible focus indicator on the close control', () => {
		cy.mountWithVuetify(DialogBox, { props: { modelValue: true, title: 'Confirmation' } })
		cy.get('.sy-dialog-box-close-btn').focus().should(($button) => {
			const style = window.getComputedStyle($button[0])
			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})
	})
})
