import CaptchaImg from './CaptchaImg.vue'
import { locales } from './locales'
describe('CaptchaImg – RGAA browser checks – CNAM theme', () => {
	it('1.3 – exposes the CAPTCHA alternative text', () => {
		cy.mountWithVuetify(CaptchaImg, { props: { state: 'resolved', src: '/captcha.png', locales } })
		cy.get('img.captcha-img').should('be.visible').and('have.attr', 'alt', locales.captchaImgAlt)
	})
})
