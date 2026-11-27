import CaptchaImg from '../CaptchaImg.vue'
import { locales } from '../locales'
describe('CaptchaImg – RGAA browser contract – CNAM theme', () => {
	it('exposes alternative text', () => {
		cy.mountWithVuetify(CaptchaImg, { props: { state: 'resolved', src: '/captcha.png', locales } })
		cy.get('img').should('have.attr', 'alt', locales.captchaImgAlt)
	})
})
