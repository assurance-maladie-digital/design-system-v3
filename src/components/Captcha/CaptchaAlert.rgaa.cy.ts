import CaptchaAlert from './CaptchaAlert.vue'
import { locales } from './locales'
describe('CaptchaAlert – RGAA browser checks – CNAM theme', () => {
	it('7.1 and 8.2 – renders the error alert and renewal action', () => {
		cy.mountWithVuetify(CaptchaAlert, { props: { locales }, slots: { default: () => 'Le CAPTCHA n’a pas pu être chargé.' } })
		cy.get('[role="alert"]').should('be.visible')
		cy.contains(locales.renew).should('be.visible')
	})
})
