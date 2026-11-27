import BackToTopBtn from '../BackToTopBtn.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

describe('BackToTopBtn – RGAA browser checks – CNAM theme', () => {
	it('3.2 – keeps sufficient contrast when visible', () => {
		cy.mountWithVuetify(BackToTopBtn, { props: { threshold: -1 } })
		cy.window().then(window => window.dispatchEvent(new Event('scroll')))
		cy.get('.vd-back-to-top-btn').should('be.visible').should(($button) => {
			expect(getTextContrast($button[0]!)).to.be.at.least(4.5)
		})
	})

	it('3.3 and 10.7 – exposes a visible focus indicator', () => {
		cy.mountWithVuetify(BackToTopBtn, { props: { threshold: -1 } })
		cy.window().then(window => window.dispatchEvent(new Event('scroll')))
		cy.get('.vd-back-to-top-btn').then(($button) => {
			($button[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
		}).should(($button) => {
			const style = window.getComputedStyle($button[0])
			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})
	})
})
