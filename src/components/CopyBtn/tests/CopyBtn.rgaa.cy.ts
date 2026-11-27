import CopyBtn from '../CopyBtn.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

describe('CopyBtn – RGAA browser checks – CNAM theme', () => {
	it('3.2 – keeps sufficient contrast for the icon button', () => {
		cy.mountWithVuetify(CopyBtn, { props: { hideTooltip: true, ariaLabel: 'Copier le texte' } })
		cy.get('.sy-copy-btn button').should(($button) => {
			expect(getTextContrast($button[0]!)).to.be.at.least(3)
		})
	})

	it('3.3 and 10.7 – exposes a visible focus indicator', () => {
		cy.mountWithVuetify(CopyBtn, { props: { hideTooltip: true } })
		cy.get('.sy-copy-btn button').focus().should(($button) => {
			const style = window.getComputedStyle($button[0])
			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})
	})
})
