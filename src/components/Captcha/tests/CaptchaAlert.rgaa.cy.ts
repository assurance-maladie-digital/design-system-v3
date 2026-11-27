import CaptchaAlert from '../CaptchaAlert.vue'
import { locales } from '../locales'
describe('CaptchaAlert – RGAA browser contract – CNAM theme', () => {
	it('exposes the alert', () => {
		cy.mountWithVuetify(CaptchaAlert, { props: { locales } })
		cy.get('[role="alert"]').should('be.visible')
	})
})
