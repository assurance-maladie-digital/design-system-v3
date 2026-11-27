import FranceConnectBtn from '../FranceConnectBtn.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

describe('FranceConnectBtn – RGAA browser checks – CNAM theme', () => {
	it('3.2 – keeps sufficient contrast for the information link', () => {
		cy.mountWithVuetify(FranceConnectBtn, { props: { href: '/connexion' } })
		cy.get('.sy-france-connect-info-link').should(($link) => {
			expect(getTextContrast($link[0]!)).to.be.at.least(4.5)
		})
	})

	it('3.3 and 10.7 – exposes a visible focus indicator on both links', () => {
		cy.mountWithVuetify(FranceConnectBtn, { props: { href: '/connexion' } })
		cy.get('.sy-france-connect-link, .sy-france-connect-info-link').each(($link) => {
			cy.wrap($link).focus().should(($focused) => {
				const style = window.getComputedStyle($focused[0])
				expect(style.outlineStyle).to.not.equal('none')
				expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
			})
		})
	})
})
