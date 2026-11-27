import CaptchaInformation from '../CaptchaInformation.vue'
import { locales } from '../locales'
describe('CaptchaInformation – RGAA browser contract – CNAM theme', () => {
	it('exposes a visible heading', () => {
		cy.mountWithVuetify(CaptchaInformation, { props: { type: 'image', locales } })
		cy.get('h3').should('be.visible')
	})
})
