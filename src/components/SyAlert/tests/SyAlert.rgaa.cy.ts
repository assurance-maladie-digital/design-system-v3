import SyAlert from '../SyAlert.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

describe('SyAlert – RGAA browser checks – CNAM theme', () => {
	it('3.2 – keeps sufficient contrast for the message', () => {
		cy.mountWithVuetify(SyAlert, { props: { type: 'info' }, slots: { default: 'Information importante' } })
		cy.get('.v-alert__content').should(($content) => {
			expect(getTextContrast($content[0]!)).to.be.at.least(4.5)
		})
	})

	it('3.3 and 10.7 – exposes a visible focus indicator on the close action', () => {
		cy.mountWithVuetify(SyAlert, { props: { closable: true }, slots: { default: 'Message' } })
		cy.get('.alert-close-btn').focus().should(($button) => {
			const style = window.getComputedStyle($button[0])
			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})
	})
})
