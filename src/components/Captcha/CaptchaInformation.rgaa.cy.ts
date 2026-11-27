import CaptchaInformation from './CaptchaInformation.vue'
import { locales } from './locales'
describe('CaptchaInformation – RGAA browser checks – CNAM theme', () => {
	it('8.2 and 9.1 – exposes a visible heading and instructions', () => {
		cy.mountWithVuetify(CaptchaInformation, { props: { type: 'image', locales } })
		cy.get('h3').should('be.visible').and('contain.text', locales.information.securityCheck)
		cy.get('.captcha-instructions').should('be.visible')
	})
})
